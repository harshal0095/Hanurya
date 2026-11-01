const UPI_ID_PATTERN = /^[A-Za-z0-9._-]{2,256}@[A-Za-z0-9.-]{2,64}$/;
const PLACEHOLDER_PAYEE_PATTERN = /payment screen|dikhana wala|payee name|merchant\/payee/i;

export function sanitizeUpiPayeeName(name: string): string {
  return name
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/gu, ' ')
    .trim()
    .slice(0, 50);
}

export function isValidUpiId(upiId: string): boolean {
  return UPI_ID_PATTERN.test(upiId.trim());
}

export function isUsableUpiPayeeName(name: string): boolean {
  const sanitized = sanitizeUpiPayeeName(name);
  return sanitized.length > 0 && !PLACEHOLDER_PAYEE_PATTERN.test(name) && !PLACEHOLDER_PAYEE_PATTERN.test(sanitized);
}

export function resolveUpiDetails(configuredUpiId?: string, configuredPayeeName?: string) {
  const candidateUpiId = configuredUpiId?.trim() ?? '';
  const upiId = isValidUpiId(candidateUpiId) ? candidateUpiId : '';

  const payeeName = configuredPayeeName && isUsableUpiPayeeName(configuredPayeeName)
    ? sanitizeUpiPayeeName(configuredPayeeName)
    : '';

  return { upiId, payeeName };
}

export function buildUpiPaymentLink(options: {
  upiId: string;
  payeeName: string;
  amount: number;
  note?: string;
}): string {
  const pa = options.upiId.trim();
  const rawPn = sanitizeUpiPayeeName(options.payeeName);
  const rawTn = sanitizeUpiPayeeName(options.note ?? 'Hanurya order');
  if (!isValidUpiId(pa)) {
    throw new Error('A valid UPI ID is required to build the payment link.');
  }
  if (!isUsableUpiPayeeName(rawPn)) {
    throw new Error('A valid merchant/payee name is required to build the payment link.');
  }
  if (!Number.isFinite(options.amount) || options.amount <= 0) {
    throw new Error('A positive payment amount is required to build the payment link.');
  }
  const am = options.amount.toFixed(2);

  // PhonePe/GPay fail with a "technical glitch" if `pa` encodes `@` as `%40`.
  // Keep literal `@` in `pa`, and URL-encode spaces in `pn` and `tn` as `%20` for NPCI compliance.
  const pn = encodeURIComponent(rawPn);
  const tn = encodeURIComponent(rawTn);

  return `upi://pay?pa=${pa}&pn=${pn}&am=${am}&cu=INR&tn=${tn}`;
}
