import crypto from 'crypto';

export const hmacSha256 = (key: string, raw: string): string =>
  crypto.createHmac('sha256', key).update(raw).digest('hex');

export const randomId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const toAmount = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export const getPublicBaseUrl = (): string =>
  process.env.PUBLIC_BASE_URL || 'http://localhost:1337';

export const isMockPaymentEnabled = (): boolean =>
  process.env.PAYMENT_MOCK !== 'false';

export const safeEqual = (left?: string, right?: string): boolean => {
  if (!left || !right || left.length !== right.length) {
    return false;
  }

  const l = Buffer.from(left);
  const r = Buffer.from(right);
  return crypto.timingSafeEqual(l, r);
};
