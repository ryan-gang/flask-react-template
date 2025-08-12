const parseUTCDate = (dateString: string): Date => {
  // Backend sends UTC time without 'Z' suffix, so add 'Z' to parse as UTC
  const utcString = dateString.endsWith('Z') ? dateString : dateString + 'Z';
  return new Date(utcString);
};

export const formatDate = (dateString: string): string => {
  const date = parseUTCDate(dateString);
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = parseUTCDate(dateString);
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }).format(date);
};
