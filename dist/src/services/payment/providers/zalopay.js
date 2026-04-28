"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zaloPayProvider = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("../utils");
const yymmdd = () => {
    const now = new Date();
    const y = `${now.getFullYear()}`.slice(-2);
    const m = `${now.getMonth() + 1}`.padStart(2, '0');
    const d = `${now.getDate()}`.padStart(2, '0');
    return `${y}${m}${d}`;
};
const parseAppTransOrderCode = (appTransId) => {
    if (!appTransId)
        return '';
    const parts = appTransId.split('_');
    return parts.slice(1).join('_') || appTransId;
};
const parseResult = (input) => {
    var _a, _b, _c, _d;
    const raw = Object.keys(input.body || {}).length ? input.body : input.query;
    let data = raw;
    if (typeof raw.data === 'string') {
        try {
            data = JSON.parse(raw.data);
        }
        catch (_e) {
            data = raw;
        }
    }
    const returnCode = Number((_d = (_c = (_b = (_a = raw.return_code) !== null && _a !== void 0 ? _a : raw.returnCode) !== null && _b !== void 0 ? _b : data.return_code) !== null && _c !== void 0 ? _c : data.returnCode) !== null && _d !== void 0 ? _d : -1);
    const appTransId = `${data.app_trans_id || raw.app_trans_id || raw.apptransid || ''}`;
    const zpTransId = data.zp_trans_id ? `${data.zp_trans_id}` : undefined;
    return {
        status: returnCode === 1 ? 'paid' : 'failed',
        orderCode: parseAppTransOrderCode(appTransId),
        gatewayTransactionId: zpTransId,
        amount: (0, utils_1.toAmount)(data.amount),
        message: raw.return_message || raw.returnMessage || data.return_message || undefined,
        raw,
    };
};
exports.zaloPayProvider = {
    async createPayment(input) {
        var _a, _b, _c;
        if ((0, utils_1.isMockPaymentEnabled)()) {
            const mockUrl = `${(0, utils_1.getPublicBaseUrl)()}/api/checkout/return/zalopay?orderCode=${encodeURIComponent(input.orderCode)}&status=success&mock=1`;
            return {
                gateway: 'zalopay',
                requestId: (0, utils_1.randomId)('zalopay'),
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
        const requestId = (0, utils_1.randomId)('zalopay');
        const appTransId = `${yymmdd()}_${input.orderCode}`;
        const appTime = Date.now();
        const embedData = JSON.stringify({ redirecturl: input.returnUrl });
        const item = JSON.stringify(((_a = input.metadata) === null || _a === void 0 ? void 0 : _a.items) || []);
        const payload = {
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
        payload.mac = (0, utils_1.hmacSha256)(key1, data);
        const body = new URLSearchParams(payload).toString();
        const response = await axios_1.default.post(endpoint, body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        return {
            gateway: 'zalopay',
            requestId,
            gatewayTransactionId: appTransId,
            paymentUrl: (_b = response.data) === null || _b === void 0 ? void 0 : _b.order_url,
            qrUrl: (_c = response.data) === null || _c === void 0 ? void 0 : _c.order_url,
            rawRequest: payload,
            rawResponse: response.data,
        };
    },
    verifySignature(input) {
        var _a, _b;
        if ((0, utils_1.isMockPaymentEnabled)()) {
            return true;
        }
        const key2 = process.env.ZALOPAY_KEY2 || '';
        const data = `${((_a = input.body) === null || _a === void 0 ? void 0 : _a.data) || ''}`;
        const mac = `${((_b = input.body) === null || _b === void 0 ? void 0 : _b.mac) || ''}`;
        if (!key2 || !data || !mac) {
            return false;
        }
        const computed = (0, utils_1.hmacSha256)(key2, data);
        return (0, utils_1.safeEqual)(computed, mac);
    },
    normalizeWebhook(input) {
        return parseResult(input);
    },
    normalizeReturn(input) {
        return parseResult(input);
    },
};
