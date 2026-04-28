import axios from 'axios';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
  NormalizedWebhookResult,
  PaymentProvider,
  VerifyInput,
} from '../types';
import { getPublicBaseUrl, hmacSha256, isMockPaymentEnabled, randomId, safeEqual, toAmount } from '../utils';

const yymmdd = () => {
  const now = new Date();
  const y = `${now.getFullYear()}`.slice(-2);
  const m = `${now.getMonth() + 1}`.padStart(2, '0');
  const d = `${now.getDate()}`.padStart(2, '0');
  return `${y}${m}${d}`;
};

const parseAppTransOrderCode = (appTransId?: string): string => {
  if (!appTransId) return '';
  const parts = appTransId.split('_');
  return parts.slice(1).join('_') || appTransId;
};

const parseResult = (input: VerifyInput): NormalizedWebhookResult => {
  const raw = Object.keys(input.body || {}).length ? input.body : input.query;

  let data: Record<string, any> = raw;
  if (typeof raw.data === 'string') {
    try {
      data = JSON.parse(raw.data);
    } catch (_e) {
      data = raw;
    }
  }

  const returnCode = Number(raw.return_code ?? raw.returnCode ?? data.return_code ?? data.returnCode ?? -1);
  const appTransId = `${data.app_trans_id || raw.app_trans_id || raw.apptransid || ''}`;
  const zpTransId = data.zp_trans_id ? `${data.zp_trans_id}` : undefined;

  return {
    status: returnCode === 1 ? 'paid' : 'failed',
    orderCode: parseAppTransOrderCode(appTransId),
    gatewayTransactionId: zpTransId,
    amount: toAmount(data.amount),
    message: raw.return_message || raw.returnMessage || data.return_message || undefined,
    raw,
  };
};

export const zaloPayProvider: PaymentProvider = {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    if (isMockPaymentEnabled()) {
      const mockUrl = `${getPublicBaseUrl()}/api/checkout/return/zalopay?orderCode=${encodeURIComponent(
        input.orderCode
      )}&status=success&mock=1`;
      return {
        gateway: 'zalopay',
        requestId: randomId('zalopay'),
        paymentUrl: mockUrl,
        qrUrl: mockUrl,
        rawRequest: input,
        rawResponse: { mode: 'mock', paymentUrl: mockUrl },
      };
    }

    const endpoint = process.env.ZALOPAY_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create';
    const appId = process.env.ZALOPAY_APP_ID || '';
    const key1 = process.env.ZALOPAY_KEY1 || '';

    if (!appId || !key1) {
      throw new Error('Missing ZALOPAY_APP_ID or ZALOPAY_KEY1');
    }

    const requestId = randomId('zalopay');
    const appTransId = `${yymmdd()}_${input.orderCode}`;
    const appTime = Date.now();
    const embedData = JSON.stringify({ redirecturl: input.returnUrl });
    const item = JSON.stringify(input.metadata?.items || []);

    const payload: Record<string, any> = {
      app_id: appId,
      app_user: 'strapi_user',
      app_trans_id: appTransId,
      app_time: appTime,
      amount: Math.round(input.amount),
      item,
      embed_data: embedData,
      description: input.orderInfo,
      callback_url: input.notifyUrl,
      bank_code: '',
    };

    const data = `${payload.app_id}|${payload.app_trans_id}|${payload.app_user}|${payload.amount}|${payload.app_time}|${payload.embed_data}|${payload.item}`;
    payload.mac = hmacSha256(key1, data);

    const body = new URLSearchParams(payload).toString();
    const response = await axios.post(endpoint, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    return {
      gateway: 'zalopay',
      requestId,
      gatewayTransactionId: appTransId,
      paymentUrl: response.data?.order_url,
      qrUrl: response.data?.order_url,
      rawRequest: payload,
      rawResponse: response.data,
    };
  },

  verifySignature(input: VerifyInput): boolean {
    if (isMockPaymentEnabled()) {
      return true;
    }

    const key2 = process.env.ZALOPAY_KEY2 || '';
    const data = `${input.body?.data || ''}`;
    const mac = `${input.body?.mac || ''}`;

    if (!key2 || !data || !mac) {
      return false;
    }

    const computed = hmacSha256(key2, data);
    return safeEqual(computed, mac);
  },

  normalizeWebhook(input: VerifyInput): NormalizedWebhookResult {
    return parseResult(input);
  },

  normalizeReturn(input: VerifyInput): NormalizedWebhookResult {
    return parseResult(input);
  },
};
