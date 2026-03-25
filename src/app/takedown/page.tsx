"use client";

import { useState } from "react";

export default function TakedownPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [materialUrl, setMaterialUrl] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For MVP, show success state
    // Full GitHub Issue creation will be added when GitHub App is set up
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-6 py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Takedown Request Received</h1>
        <p className="mb-6 text-sm text-gray-500">
          We will review your request and respond within 48 hours. The material will be hidden
          pending review.
        </p>
        <a
          href="/"
          className="inline-block rounded-lg bg-[#2774AE] px-5 py-2 text-sm font-semibold text-white"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Takedown Request</h1>
      <p className="mb-8 text-xs text-gray-500">
        If you are a copyright holder and believe material on this site infringes your rights,
        please fill out this form. We will acknowledge within 48 hours and hide the material
        pending review.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="takedown-name" className="mb-1 block text-sm font-semibold text-gray-700">Your Name</label>
          <input
            id="takedown-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2774AE]"
          />
        </div>

        <div>
          <label htmlFor="takedown-email" className="mb-1 block text-sm font-semibold text-gray-700">Email</label>
          <input
            id="takedown-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2774AE]"
          />
        </div>

        <div>
          <label htmlFor="takedown-url" className="mb-1 block text-sm font-semibold text-gray-700">Material URL</label>
          <input
            id="takedown-url"
            type="text"
            required
            value={materialUrl}
            onChange={(e) => setMaterialUrl(e.target.value)}
            placeholder="URL or description of the material"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2774AE]"
          />
        </div>

        <div>
          <label htmlFor="takedown-reason" className="mb-1 block text-sm font-semibold text-gray-700">
            Reason for Takedown
          </label>
          <textarea
            id="takedown-reason"
            required
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please describe why this material should be removed..."
            className="h-28 w-full resize-y rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#2774AE]"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          Submit Takedown Request
        </button>
      </form>
    </div>
  );
}
