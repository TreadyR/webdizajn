export const parseServerDateTime = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    let normalized = String(value).trim();

    // Backend can return values like "YYYY-MM-DD HH:mm:ss".
    if (normalized.includes(' ') && !normalized.includes('T')) {
        normalized = normalized.replace(' ', 'T');
    }

    // If timezone is missing, treat the timestamp as UTC to avoid locale drift.
    const hasTimezone = /([zZ]|[+-]\d{2}:\d{2})$/.test(normalized);
    if (!hasTimezone) {
        normalized = `${normalized}Z`;
    }

    const parsed = new Date(normalized);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const toDatetimeLocalValue = (value) => {
    const date = parseServerDateTime(value);
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const fromDatetimeLocalValue = (value) => {
    if (!value) return '';

    const normalized = value.length === 16 ? `${value}:00` : value;
    const parsed = new Date(normalized);

    if (Number.isNaN(parsed.getTime())) {
        return '';
    }

    return parsed.toISOString();
};
