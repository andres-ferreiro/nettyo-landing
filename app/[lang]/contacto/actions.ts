"use server";

import es from "../dictionaries/es.json";
import en from "../dictionaries/en.json";

const DICTS = { es, en } as const;

export type ContactFormState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> }
  | { status: "success"; prefill?: { firstName: string; lastName: string; email: string; phone: string } };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// E.164: + followed by 8-15 digits total, first digit 1-9. This is what
// react-phone-number-input's onChange hands back once a number is valid,
// and what GHL's API expects — GHL rejects national-format numbers.
const PHONE_RE = /^\+[1-9]\d{7,14}$/;

function str(formData: FormData, key: string) {
  return formData.get(key)?.toString().trim() ?? "";
}

// Isolated on purpose: whether this note can ride in the same POST /contacts/
// call or needs a separate POST /contacts/{id}/notes call is unconfirmed
// against GHL's live API (see docs/superpowers/specs/2026-08-27-contacto-form-design.md).
// A note-write failure never fails the whole submission — the lead is already
// captured by the point this runs, which is what actually matters.
async function addContactNote(contactId: string, token: string, note: string) {
  try {
    const res = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ body: note }),
    });
    if (!res.ok) {
      console.error("GHL note write failed", res.status, await res.text());
    }
  } catch (err) {
    console.error("GHL note write threw", err);
  }
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const locale = str(formData, "locale") === "en" ? "en" : "es";
  const t = DICTS[locale].contacto;

  // Honeypot: real users never fill a field they can't see. Fake success,
  // never call GHL, never tell the bot the trap worked.
  if (str(formData, "company_website")) {
    return { status: "success" };
  }

  const name = str(formData, "name");
  const email = str(formData, "email");
  const company = str(formData, "company");
  const phone = str(formData, "phone");
  const message = str(formData, "message");
  const interestIdx = Number(str(formData, "interest"));
  const challengeIdx = Number(str(formData, "challenge"));

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = t.errors.required;
  if (!email) fieldErrors.email = t.errors.required;
  else if (!EMAIL_RE.test(email)) fieldErrors.email = t.errors.invalidEmail;
  if (!phone) fieldErrors.phone = t.errors.required;
  else if (!PHONE_RE.test(phone)) fieldErrors.phone = t.errors.invalidPhone;
  if (!company) fieldErrors.company = t.errors.required;
  // Re-validated server-side against the known option count — never trust a
  // client-submitted index blindly, a spoofed POST could send anything.
  if (
    !Number.isInteger(interestIdx) ||
    interestIdx < 0 ||
    interestIdx >= t.form.interestOptions.length
  ) {
    fieldErrors.interest = t.errors.required;
  }
  if (
    !Number.isInteger(challengeIdx) ||
    challengeIdx < 0 ||
    challengeIdx >= t.form.challengeOptions.length
  ) {
    fieldErrors.challenge = t.errors.required;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: t.errors.generic, fieldErrors };
  }

  const token = process.env.GHL_API_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!token || !locationId) {
    console.error("GHL_API_TOKEN / GHL_LOCATION_ID not configured");
    return { status: "error", message: t.errors.generic };
  }

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  try {
    const res = await fetch("https://services.leadconnectorhq.com/contacts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: "2021-07-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        locationId,
        firstName,
        lastName: lastName || undefined,
        email,
        phone: phone || undefined,
        companyName: company || undefined,
      }),
    });

    if (!res.ok) {
      console.error("GHL contact creation failed", res.status, await res.text());
      return { status: "error", message: t.errors.generic };
    }

    const data = await res.json();
    const contactId: string | undefined = data?.contact?.id ?? data?.id;

    const note = [
      `Interés: ${t.form.interestOptions[interestIdx]}`,
      `Reto: ${t.form.challengeOptions[challengeIdx]}`,
      message && `Mensaje: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");

    if (contactId) {
      await addContactNote(contactId, token, note);
    } else {
      console.error("GHL contact creation returned no id, skipping note", data);
    }

    return {
      status: "success",
      prefill: { firstName, lastName, email, phone },
    };
  } catch (err) {
    console.error("GHL contact creation threw", err);
    return { status: "error", message: t.errors.generic };
  }
}
