"use client";

import { useState } from "react";

/** Password field with a show/hide (eye) toggle. Drop-in for `<input
 *  type="password">` -- accepts the same props, plus an optional `name`/`id`. */
export function PasswordInput({
  value,
  onChange,
  className = "",
  autoFocus,
  minLength,
  placeholder,
  autoComplete,
  required,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        className={`input pr-11 ${className}`}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        minLength={minLength}
        autoFocus={autoFocus}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-1 top-1/2 flex h-8 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.5 5.2A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17.5 17.5 0 0 1-2.2 3M6.6 6.6C4 8.5 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
