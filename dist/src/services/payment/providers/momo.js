"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.momoProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
const signatureFromPayload = (payload, accessKey) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return [
        `accessKey=${accessKey}`,
        `amount=${(_a = payload.amount) !== null && _a !== void 0 ? _a : ''}`,
        `extraData=${(_b = payload.extraData) !== null && _b !== void 0 ? _b : ''}`,
        `message=${(_c = payload.message) !== null && _c !== void 0 ? _c : ''}`,
        `orderId=${(_d = payload.orderId) !== null && _d !== void 0 ? _d : ''}`,
        `orderInfo=${(_e = payload.orderInfo) !== null && _e !== void 0 ? _e : ''}`,
        `orderType=${(_f = payload.orderType) !== null && _f !== void 0 ? _f : ''}`,
        `partnerCode=${(_g = payload.partnerCode) !== null && _g !== void 0 ? _g : ''}`,
        `payType=${(_h = payload.payType) !== null && _h !== void 0 ? _h : ''}`,
        `requestId=${(_j = payload.requestId) !== null && _j !== void 0 ? _j : ''}`,
        `responseTime=${(_k = payload.responseTime) !== null && _k !== void 0 ? _k : ''}`,
        `resultCode=${(_l = payload.resultCode) !== null && _l !== void 0 ? _l : ''}`,
        `transId=${(_m = payload.transId) !== null && _m !== void 0 ? _m : ''}`,
    ].join('&');
};
const parseResult = (input) => {
    const raw = Object.keys(input.body || {}).length ? input.body : input.query;
    const resultCode = Number(raw.resultCode);
    return {
        status: resultCode === 0 ? 'paid' : 'failed',
        orderCode: `${raw.orderId || ''}`,
        requestId: raw.requestId ? `${raw.requestId}` : undefined,
        gatewayTransactionId: raw.transId ? `${raw.transId}` : undefined,
        amount: (0, utils_1.toAmount)(raw.amount),
        message: raw.message ? `${raw.message}` : undefined,
        raw,
    };
};
exports.momoProvider = {
    async createPayment(input) {
        if ((0, utils_1.isMockPaymentEnabled)()) {
            const mockUrl = `${(0, utils_1.getPublicBaseUrl)()}/api/checkout/return/momo?orderCode=${encodeURIComponent(input.orderCode)}&status=success&mock=1`;
            return {
                gateway: 'momo',
                requestId: (0, utils_1.randomId)('momo'),
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
        const requestId = (0, utils_1.randomId)('momo');
        const payload = {
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
        payload.signature = (0, utils_1.hmacSha256)(secretKey, rawSignature);
        const { data } = await axios_1.default.post(endpoint, payload, {
            headers: { 'Content-Type': 'application/json' },
        });
        return {
            gateway: 'momo',
            requestId,
            gatewayTransactionId: (data === null || data === void 0 ? void 0 : data.transId) ? `${data.transId}` : undefined,
            paymentUrl: data === null || data === void 0 ? void 0 : data.payUrl,
            qrUrl: data === null || data === void 0 ? void 0 : data.qrCodeUrl,
            rawRequest: payload,
            rawResponse: data,
        };
    },
    verifySignature(input) {
        if ((0, utils_1.isMockPaymentEnabled)()) {
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
        const computed = (0, utils_1.hmacSha256)(secretKey, raw);
        return (0, utils_1.safeEqual)(computed, signature);
    },
    normalizeWebhook(input) {
        return parseResult(input);
    },
    normalizeReturn(input) {
        return parseResult(input);
    },
};
