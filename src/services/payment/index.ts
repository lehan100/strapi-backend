import { momoProvider } from './providers/momo';
import { vnpayProvider } from './providers/vnpay';
import { zaloPayProvider } from './providers/zalopay';
import { PaymentGateway, PaymentProvider } from './types';

const providerMap: Record<PaymentGateway, PaymentProvider> = {
  momo: momoProvider,
  zalopay: zaloPayProvider,
  vnpay: vnpayProvider,
};

export const getPaymentProvider = (gateway: PaymentGateway): PaymentProvider => {
  const provider = providerMap[gateway];
  if (!provider) {
    throw new Error(`Unsupported payment gateway: ${gateway}`);
  }

  return provider;
};
