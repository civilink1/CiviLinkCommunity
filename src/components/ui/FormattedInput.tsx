/**
 * FormattedInput – lightweight controlled inputs with auto-formatting.
 * No external libraries. Pure React + TypeScript.
 */
import * as React from 'react';
import { cn } from './utils';

type FormattedInputProps = Omit<React.ComponentProps<'input'>, 'onChange'> & {
  format: 'phone' | 'digits';
  maxDigits?: number;
  onChange?: (formatted: string, raw: string) => void;
};

/** Strip everything except digits */
function digitsOnly(v: string) {
  return v.replace(/\D/g, '');
}

/** Format "(XXX) XXX-XXXX" */
function formatPhone(raw: string): string {
  const d = digitsOnly(raw).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

export function FormattedInput({
  format,
  maxDigits,
  onChange,
  className,
  value,
  ...props
}: FormattedInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = digitsOnly(e.target.value);
    const capped = maxDigits ? raw.slice(0, maxDigits) : raw;
    let formatted = capped;
    if (format === 'phone') formatted = formatPhone(capped);
    onChange?.(formatted, capped);
  };

  return (
    <input
      {...props}
      value={value ?? ''}
      onChange={handleChange}
      className={cn(
        'flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    />
  );
}
