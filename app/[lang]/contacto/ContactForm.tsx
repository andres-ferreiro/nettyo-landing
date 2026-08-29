"use client";

import { useActionState, useState } from "react";
import FormField from "./FormField";
import PillOption from "./PillOption";
import BookingReveal from "./BookingReveal";
import { PhoneInput } from "./phone-input/phone-input";
import { submitContactForm, type ContactFormState } from "./actions";

type Dict = {
  form: {
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    interestLabel: string;
    interestOptions: readonly string[];
    challengeLabel: string;
    challengeOptions: readonly string[];
    messageLabel: string;
    messagePlaceholder: string;
    submitCta: string;
    submitCtaPending: string;
    privacyNote: string;
  };
  success: { headline: string; body: string; bookCta: string; bookButton: string };
};

const initialState: ContactFormState = { status: "idle" };

export default function ContactForm({ t, locale }: { t: Dict; locale: string }) {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState);
  const errors = state.status === "error" ? state.fieldErrors : undefined;
  // Controlled: react-phone-number-input's visible field shows a national
  // format ("(415) 555-1234"), not the E.164 string GHL needs — a hidden
  // input mirrors the real value so the plain FormData submit still carries
  // the E.164 string, not what's on screen.
  const [phone, setPhone] = useState("");

  if (state.status === "success") {
    return (
      <div>
        <h2 className="text-2xl font-medium tracking-tight text-foreground">
          {t.success.headline}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground-secondary">
          {t.success.body}
        </p>
        <BookingReveal
          cta={t.success.bookCta}
          buttonLabel={t.success.bookButton}
          prefill={state.prefill}
        />
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3.5">
      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot: real visitors never see or fill this. Not tab-reachable. */}
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />

      {state.status === "error" && !errors && (
        <p className="border border-danger px-4 py-2 text-sm text-danger">{state.message}</p>
      )}

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <FormField
          name="name"
          label={t.form.nameLabel}
          placeholder={t.form.namePlaceholder}
          required
          error={errors?.name}
        />
        <FormField
          name="email"
          type="email"
          label={t.form.emailLabel}
          placeholder={t.form.emailPlaceholder}
          required
          error={errors?.email}
        />
      </div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone-input"
            className="font-mono text-xs tracking-wide text-foreground uppercase"
          >
            {t.form.phoneLabel}
            <span aria-hidden> *</span>
          </label>
          <PhoneInput
            id="phone-input"
            international
            defaultCountry={locale === "en" ? "US" : "MX"}
            value={phone}
            onChange={(value) => setPhone(value ?? "")}
            placeholder={t.form.phonePlaceholder}
            className="mt-1.5"
          />
          <input type="hidden" name="phone" value={phone} />
          {errors?.phone && <p className="mt-1 text-xs text-danger">{errors.phone}</p>}
        </div>
        <FormField
          name="company"
          label={t.form.companyLabel}
          placeholder={t.form.companyPlaceholder}
          required
          error={errors?.company}
        />
      </div>

      <fieldset>
        <legend className="font-mono text-xs tracking-wide text-foreground uppercase">
          {t.form.interestLabel}
        </legend>
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-2.5">
          {t.form.interestOptions.map((label, i) => (
            <PillOption key={label} name="interest" value={String(i)} label={label} />
          ))}
        </div>
        {errors?.interest && <p className="mt-1 text-xs text-danger">{errors.interest}</p>}
      </fieldset>

      <fieldset>
        <legend className="font-mono text-xs tracking-wide text-foreground uppercase">
          {t.form.challengeLabel}
        </legend>
        <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-2.5">
          {t.form.challengeOptions.map((label, i) => (
            <PillOption key={label} name="challenge" value={String(i)} label={label} />
          ))}
        </div>
        {errors?.challenge && <p className="mt-1 text-xs text-danger">{errors.challenge}</p>}
      </fieldset>

      <FormField
        as="textarea"
        name="message"
        label={t.form.messageLabel}
        placeholder={t.form.messagePlaceholder}
      />

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 w-full items-center justify-center bg-foreground px-10 font-mono text-xs tracking-wider text-background uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong disabled:opacity-60"
        >
          {isPending ? t.form.submitCtaPending : t.form.submitCta}
        </button>
        <p className="mt-2 text-xs text-foreground-secondary">{t.form.privacyNote}</p>
      </div>
    </form>
  );
}
