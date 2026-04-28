"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/checkout/create-payment',
            handler: 'checkout.createPayment',
            config: {
                auth: false,
            },
        },
        {
            method: 'POST',
            path: '/checkout/webhook/:gateway',
            handler: 'checkout.webhook',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/checkout/return/:gateway',
            handler: 'checkout.paymentReturn',
            config: {
                auth: false,
            },
        },
        {
            method: 'GET',
            path: '/checkout/status/:orderCode',
            handler: 'checkout.status',
            config: {
                auth: false,
            },
        },
    ],
};
