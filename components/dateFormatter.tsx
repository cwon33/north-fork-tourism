import { Timestamp } from 'firebase/firestore';
const pad2 = (n: number) => String(n).padStart(2, '0');

// Format: "MM/DD hh:mm" (12-hour, no AM/PM)
export const formatMMDD_hhmm = (d: Date): string => {
  const mm = pad2(d.getMonth() + 1);
  const dd = pad2(d.getDate());
  const mins = pad2(d.getMinutes());
  const hour24 = d.getHours();
  const hour12 = hour24 % 12 || 12; // 0→12
  const hh = pad2(hour12);
  return `${mm}/${dd} ${hh}:${mins}`;
};

// Safely convert anything Timestamp/Date/number/string → Date | null
export const toDate = (v: unknown): Date | null => {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof (v as any)?.toDate === 'function')
    return (v as Timestamp).toDate();
  if (typeof v === 'number') {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof v === 'string') {
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
};
