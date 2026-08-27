"use client";

import { useState } from "react";
import Script from "next/script";

const BOOKING_BASE_URL = "https://api.getsyntra.io/widget/booking/9zJEhsSDkgNFX4guWUJC";

type Prefill = { firstName: string; lastName: string; email: string; phone: string };

// GHL's calendar widget accepts prefill via query params on the iframe src —
// first_name/last_name/email/phone match the widget's own visible field
// labels ("First name", "Last name", "Phone", "Email"), but the exact param
// names are inferred from the widget's public behaviour, not a confirmed API
// contract (same honesty as actions.ts's note-endpoint flag) — verify the
// fields actually populate once tested against the real embed, and adjust
// the keys here if they don't.
function bookingUrl(prefill?: Prefill) {
  if (!prefill) return BOOKING_BASE_URL;
  const params = new URLSearchParams();
  if (prefill.firstName) params.set("first_name", prefill.firstName);
  if (prefill.lastName) params.set("last_name", prefill.lastName);
  if (prefill.email) params.set("email", prefill.email);
  if (prefill.phone) params.set("phone", prefill.phone);
  const query = params.toString();
  return query ? `${BOOKING_BASE_URL}?${query}` : BOOKING_BASE_URL;
}

// The booking calendar only mounts on demand now — not shown upfront, only
// reachable via the success state's "book a call instead?" CTA. Iframe/script
// pair is unchanged from the page's previous always-on embed, plus prefill.
export default function BookingReveal({
  cta,
  buttonLabel,
  prefill,
}: {
  cta: string;
  buttonLabel: string;
  prefill?: Prefill;
}) {
  const [revealed, setRevealed] = useState(false);

  if (!revealed) {
    return (
      <div className="mt-8 border-t border-border pt-6">
        <p className="text-sm text-foreground-secondary">{cta}</p>
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-3 font-mono text-xs tracking-wide text-accent-strong uppercase underline underline-offset-4 hover:text-accent-strong-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong"
        >
          {buttonLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <iframe
        src={bookingUrl(prefill)}
        style={{ width: "100%", border: "none", outline: "none", overflow: "hidden" }}
        scrolling="no"
        id="9zJEhsSDkgNFX4guWUJC_1787856439491"
      />
      <Script src="https://api.getsyntra.io/js/form_embed.js" strategy="afterInteractive" />
    </div>
  );
}
