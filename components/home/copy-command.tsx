'use client';

import { useState } from 'react';
import { Check, Copy } from '@phosphor-icons/react';

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button type="button" className="vx-cmd" onClick={copy} aria-label={`Copy ${command}`}>
      <span className="vx-cmd-prompt">$</span>
      <span className="vx-cmd-text">{command}</span>
      {copied ? <Check size={15} weight="bold" /> : <Copy size={15} />}
    </button>
  );
}
