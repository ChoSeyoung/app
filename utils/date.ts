function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function parseDateValue(value: string | Date): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() === year &&
      parsed.getMonth() === month - 1 &&
      parsed.getDate() === day
    ) {
      return parsed;
    }
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDisplayDate(value: string | Date): string {
  const parsed = parseDateValue(value);
  if (!parsed) return '-';
  return `${parsed.getFullYear()}.${pad(parsed.getMonth() + 1)}.${pad(parsed.getDate())}`;
}

export function formatDisplayDateWithWeekday(value: string | Date, locale = 'ko-KR'): string {
  const parsed = parseDateValue(value);
  if (!parsed) return '-';
  const weekday = parsed.toLocaleDateString(locale, { weekday: 'short' });
  return `${formatDisplayDate(parsed)} · ${weekday}`;
}
