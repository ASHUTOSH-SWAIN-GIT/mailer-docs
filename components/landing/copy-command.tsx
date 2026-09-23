'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be unavailable (insecure context, denied permission).
      // The command stays visible and selectable, so there is nothing to recover.
    }
  }

  return (
    <div className="lp-command">
      <code>
        <span className="lp-prompt" aria-hidden="true">$</span> {command}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied' : 'Copy the install command'}
      >
        {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      </button>
      <span className="lp-sr" role="status" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  );
}
