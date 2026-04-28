export type PaymentGateway = 'momo' | 'zalopay' | 'vnpay';

export type PaymentResultStatus = 'paid' | 'failed' | 'pending';

export interface CreatePaymentInput {
  orderCode: string;
  amount: number;
  orderInfo: string;
  returnUrl: string;
  notifyUrl: string;
  metadata?: Record<string, unknown>;
}

export interface CreatePaymentOutput {
  gateway: PaymentGateway;
  requestId: string;
  gatewayTransactionId?: string;
  paymentUrl?: string;
  qrUrl?: string;
  rawRequest?: unknown;
  rawResponse?: unknown;
}

export interface VerifyInput {
  body: Record<string, any>;
  query: Record<string, any>;
  headers: Record<string, any>;
}

export interface NormalizedWebhookResult {
  status: PaymentResultStatus;
  orderCode: string;
  requestId?: string;
  gatewayTransactionId?: string;
  amount?: number;
  message?: string;
  raw?: unknown;
}

export interface PaymentProvider {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput>;
  verifySignature(input: VerifyInput): boolean;
  normalizeWebhook(input: VerifyInput): NormalizedWebhookResult;
  normalizeReturn(input: VerifyInput): NormalizedWebhookResult;
}
