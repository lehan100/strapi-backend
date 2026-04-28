"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vnpayProvider = void 0;
const utils_1 = require("../utils");
const vnpayDate = () => {
    const now = new Date();
    const y = now.getFullYear().toString();
    const m = `${now.getMonth() + 1}`.padStart(2, '0');
    const d = `${now.getDate()}`.padStart(2, '0');
    const hh = `${now.getHours()}`.padStart(2, '0');
    const mm = `${now.getMinutes()}`.padStart(2, '0');
    const ss = `${now.getSeconds()}`.padStart(2, '0');
    return `${y}${m}${d}${hh}${mm}${ss}`;
};
const buildSignData = (params) => {
    const filtered = Object.entries(params).filter(([k, v]) => k !== 'vnp_SecureHash' && k !== 'vnp_SecureHashType' && v !== undefined && v !== null);
    const sorted = filtered.sort(([a], [b]) => a.localeCompare(b));
    return new URLSearchParams(sorted).toString();
};
const parseResult = (input) => {
    const raw = Object.keys(input.query || {}).length ? input.query : input.body;
    const orderCode = `${raw.vnp_TxnRef || ''}`;
    const responseCode = `${raw.vnp_ResponseCode || ''}`;
    const transactionNo = raw.vnp_TransactionNo ? `${raw.vnp_TransactionNo}` : undefined;
    const amount = raw.vnp_Amount ? (0, utils_1.toAmount)(raw.vnp_Amount) / 100 : undefined;
    return {
        status: responseCode === '00' ? 'paid' : 'failed',
        orderCode,
        gatewayTransactionId: transactionNo,
        amount,
        message: raw.vnp_OrderInfo ? `${raw.vnp_OrderInfo}` : undefined,
        raw,
    };
};
exports.vnpayProvider = {
    async createPayment(input) {
        if ((0, utils_1.isMockPaymentEnabled)()) {
            const mockUrl = `${(0, utils_1.getPublicBaseUrl)()}/api/checkout/return/vnpay?orderCode=${encodeURIComponent(input.orderCode)}&status=success&mock=1`;
            return {
                gateway: 'vnpay',
                requestId: (0, utils_1.randomId)('vnpay'),
                paymentUrl: mockUrl,
                rawRequest: input,
                rawResponse: { mode: 'mock', paymentUrl: mockUrl },
            };
        }
        const tmnCode = process.env.VNPAY_TMN_CODE || '';
        const hashSecret = process.env.VNPAY_HASH_SECRET || '';
        const paymentUrl = process.env.VNPAY_PAYMENT_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        if (!tmnCode || !hashSecret) {
            throw new Error('Missing VNPAY_TMN_CODE or VNPAY_HASH_SECRET');
        }
        const requestId = (0, utils_1.randomId)('vnpay');
        const params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Amount: `${Math.round(input.amount * 100)}`,
            vnp_CurrCode: 'VND',
            vnp_TxnRef: input.orderCode,
            vnp_OrderInfo: input.orderInfo,
            vnp_OrderType: 'other',
            vnp_Locale: 'vn',
            vnp_ReturnUrl: input.returnUrl,
            vnp_IpAddr: '127.0.0.1',
            vnp_CreateDate: vnpayDate(),
        };
        const signData = buildSignData(params);
        const secureHash = (0, utils_1.hmacSha256)(hashSecret, signData);
        const fullUrl = `${paymentUrl}?${signData}&vnp_SecureHash=${secureHash}`;
        return {
            gateway: 'vnpay',
            requestId,
            paymentUrl: fullUrl,
            rawRequest: params,
            rawResponse: { paymentUrl: fullUrl },
        };
    },
    verifySignature(input) {
        if ((0, utils_1.isMockPaymentEnabled)()) {
            return true;
        }
        const raw = Object.keys(input.query || {}).length ? input.query : input.body;
        const hashSecret = process.env.VNPAY_HASH_SECRET || '';
        const received = `${raw.vnp_SecureHash || ''}`;
        if (!hashSecret || !received) {
            return false;
        }
        const signData = buildSignData(raw);
        const computed = (0, utils_1.hmacSha256)(hashSecret, signData);
        return (0, utils_1.safeEqual)(computed, received);
    },
    normalizeWebhook(input) {
        return parseResult(input);
    },
    normalizeReturn(input) {
        return parseResult(input);
    },
};
