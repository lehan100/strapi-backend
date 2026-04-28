"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentProvider = void 0;
const momo_1 = require("./providers/momo");
const vnpay_1 = require("./providers/vnpay");
const zalopay_1 = require("./providers/zalopay");
const providerMap = {
    momo: momo_1.momoProvider,
    zalopay: zalopay_1.zaloPayProvider,
    vnpay: vnpay_1.vnpayProvider,
};
const getPaymentProvider = (gateway) => {
    const provider = providerMap[gateway];
    if (!provider) {
        throw new Error(`Unsupported payment gateway: ${gateway}`);
    }
    return provider;
};
exports.getPaymentProvider = getPaymentProvider;
