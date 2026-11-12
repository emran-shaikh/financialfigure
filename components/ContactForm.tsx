"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

const inputCls =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-teal-700";

/**
 * Contact form with no backend. Submitting opens the visitor's own email client
 * with the message pre-filled, so nothing is transmitted to (or stored by) us.
 */
export default function ContactForm() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("Correction or data issue");
  const [message, setMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = `[${SITE.name}] ${topic}`;
    const body = `${message}\n\n— ${name || "Sent from the contact form"}`;
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="not-prose max-w-prose space-y-4">
      <p className="rounded-md bg-slate-100 p-3 text-sm text-slate-600">
        This form opens your own email app and sends the message from your account. Nothing is stored
        on this site.
      </p>

      <div>
        <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">
          Your name (optional)
        </label>
        <input
          id="contact-name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="contact-topic" className="text-sm font-medium text-slate-700">
          What is this about?
        </label>
        <select
          id="contact-topic"
          name="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className={inputCls}
        >
          <option>Correction or data issue</option>
          <option>Calculator suggestion</option>
          <option>General feedback</option>
          <option>Advertising or partnership</option>
          <option>Privacy or data request</option>
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputCls}
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-teal-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-900"
      >
        Open email draft
      </button>
    </form>
  );
}
