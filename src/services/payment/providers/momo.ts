import axios from 'axios';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
  NormalizedWebhookResult,
  PaymentProvider,
  VerifyInput,
} from '../types';
import { getPublicBaseUrl, hmacSha256, isMockPaymentEnabled, randomId, safeEqual, toAmount } from '../utils';

const signatureFromPayload = (payload: Record<string, any>, accessKey: string) =>
  [
    `accessKey=${accessKey}`,
    `amount=${payload.amount ?? ''}`,
    `extraData=${payload.extraData ?? ''}`,
    `message=${payload.message ?? ''}`,
    `orderId=${payload.orderId ?? ''}`,
    `orderInfo=${payload.orderInfo ?? ''}`,
    `orderType=${payload.orderType ?? ''}`,
    `partnerCode=${payload.partnerCode ?? ''}`,
    `payType=${payload.payType ?? ''}`,
    `requestId=${payload.requestId ?? ''}`,
    `responseTime=${payload.responseTime ?? ''}`,
    `resultCode=${payload.resultCode ?? ''}`,
    `transId=${payload.transId ?? ''}`,
  ].join('&');

const parseResult = (input: VerifyInput): NormalizedWebhookResult => {
  const raw = Object.keys(input.body || {}).length ? input.body : input.query;
  const resultCode = Number(raw.resultCode);
  return {
    status: resultCode === 0 ? 'paid' : 'failed',
    orderCode: `${raw.orderId || ''}`,
    requestId: raw.requestId ? `${raw.requestId}` : undefined,
    gatewayTransactionId: raw.transId ? `${raw.transId}` : undefined,
    amount: toAmount(raw.amount),
    message: raw.message ? `${raw.message}` : undefined,
    raw,
  };
};

export const momoProvider: PaymentProvider = {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    if (isMockPaymentEnabled()) {
      const mockUrl = `${getPublicBaseUrl()}/api/checkout/return/momo?orderCode=${encodeURIComponent(
        input.orderCode
      )}&status=success&mock=1`;
      return {
        gateway: 'momo',
        requestId: randomId('momo'),
        paymentUrl: mockUrl,
        qrUrl: mockUrl,
        rawRequest: input,
        rawResponse: { mode: 'mock', paymentUrl: mockUrl },
      };
    }

    const endpoint = process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create';
    const partnerCode = process.env.MOMO_PARTNER_CODE || '';
    const accessKey = process.env.MOMO_ACCESS_KEY || '';
    const secretKey = process.env.MOMO_SECRET_KEY || '';
    const requestType = process.env.MOMO_REQUEST_TYPE || 'captureWallet';

    if (!partnerCode || !accessKey || !secretKey) {
      throw new Error('Missing MOMO_PARTNER_CODE, MOMO_ACCESS_KEY, MOMO_SECRET_KEY');
    }

    const requestId = randomId('momo');
    const payload: Record<string, any> = {
      partnerCode,
      partnerName: 'Strapi Checkout',
      storeId: 'StrapiStore',
      requestId,
      amount: `${Math.round(input.amount)}`,
      orderId: input.orderCode,
      orderInfo: input.orderInfo,
      redirectUrl: input.returnUrl,
      ipnUrl: input.notifyUrl,
      lang: 'vi',
      requestType,
      autoCapture: true,
      extraData: '',
    };

    const rawSignature = [
      `accessKey=${accessKey}`,
      `amount=${payload.amount}`,
      `extraData=${payload.extraData}`,
      `ipnUrl=${payload.ipnUrl}`,
      `orderId=${payload.orderId}`,
      `orderInfo=${payload.orderInfo}`,
      `partnerCode=${payload.partnerCode}`,
      `redirectUrl=${payload.redirectUrl}`,
      `requestId=${payload.requestId}`,
      `requestType=${payload.requestType}`,
    ].join('&');

    payload.signature = hmacSha256(secretKey, rawSignature);

    const { data } = await axios.post(endpoint, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    return {
      gateway: 'momo',
      requestId,
      gatewayTransactionId: data?.transId ? `${data.transId}` : undefined,
      paymentUrl: data?.payUrl,
      qrUrl: data?.qrCodeUrl,
      rawRequest: payload,
      rawResponse: data,
    };
  },

  verifySignature(input: VerifyInput): boolean {
    if (isMockPaymentEnabled()) {
      return true;
    }

    const payload = input.body || {};
    const secretKey = process.env.MOMO_SECRET_KEY || '';
    const accessKey = process.env.MOMO_ACCESS_KEY || '';
    const signature = `${payload.signature || ''}`;

    if (!secretKey || !accessKey || !signature) {
      return false;
    }

    const raw = signatureFromPayload(payload, accessKey);
    const computed = hmacSha256(secretKey, raw);
    return safeEqual(computed, signature);
  },

  normalizeWebhook(input: VerifyInput): NormalizedWebhookResult {
    return parseResult(input);
  },

  normalizeReturn(input: VerifyInput): NormalizedWebhookResult {
    return parseResult(input);
  },
};
