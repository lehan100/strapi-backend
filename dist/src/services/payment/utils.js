"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeEqual = exports.isMockPaymentEnabled = exports.getPublicBaseUrl = exports.toAmount = exports.randomId = exports.hmacSha256 = void 0;
const crypto_1 = __importDefault(require("crypto"));
const hmacSha256 = (key, raw) => crypto_1.default.createHmac('sha256', key).update(raw).digest('hex');
exports.hmacSha256 = hmacSha256;
const randomId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
exports.randomId = randomId;
const toAmount = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
};
exports.toAmount = toAmount;
const getPublicBaseUrl = () => process.env.PUBLIC_BASE_URL || 'http://localhost:1337';
exports.getPublicBaseUrl = getPublicBaseUrl;
const isMockPaymentEnabled = () => process.env.PAYMENT_MOCK !== 'false';
exports.isMockPaymentEnabled = isMockPaymentEnabled;
const safeEqual = (left, right) => {
    if (!left || !right || left.length !== right.length) {
        return false;
    }
    const l = Buffer.from(left);
    const r = Buffer.from(right);
    return crypto_1.default.timingSafeEqual(l, r);
};
exports.safeEqual = safeEqual;
