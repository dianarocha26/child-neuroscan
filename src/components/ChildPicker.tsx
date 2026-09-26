import { useEffect, useState } from 'react';
import { useChildren } from '../contexts/ChildrenContext';

interface ChildPickerProps {
  value: string;
  onChange: (name: string) => void;
  id?: string;
  required?: boolean;
  className: string;
}

const OTHER = '__other__';

/**
 * Child name field. Offers the parent's saved child profiles; falls back to
 * free text when there are none or "Someone else" is picked. Stores the name
 * as text, so existing rows keep working.
 */
export function ChildPicker({ value, onChange, id, required, className }: ChildPickerProps) {
  const { childList } = useChildren();
  const names = childList.map(c => c.child_name);
  const [typing, setTyping] = useState(false);
  const isKnown = names.includes(value);

  // Pre-fill the only child so single-child families never pick a required name.
  useEffect(() => {
    if (required && !value && !typing && names.length === 1) onChange(names[0]);
  }, [required, value, typing, names.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (names.length === 0 || typing || (value && !isKnown)) {
    return (
      <input
        id={id}
        type="text"
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        autoFocus={typing}
      />
    );
  }

  return (
    <select
      id={id}
      required={required}
      value={value}
      onChange={(e) => {
        if (e.target.value === OTHER) {
          setTyping(true);
          onChange('');
        } else {
          onChange(e.target.value);
        }
      }}
      className={`${className} bg-white`}
    >
      <option value="">Select a child</option>
      {names.map(name => <option key={name} value={name}>{name}</option>)}
      <option value={OTHER}>Someone else…</option>
    </select>
  );
}
