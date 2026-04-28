"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkoutService = (strapi) => strapi.service('api::checkout.checkout');
exports.default = {
    async createPayment(ctx) {
        const { orderId, gateway, returnUrl } = ctx.request.body || {};
        const result = await checkoutService(strapi).createPayment({
            orderId,
            gateway,
            returnUrl,
        });
        ctx.body = result;
    },
    async webhook(ctx) {
        const gateway = `${ctx.params.gateway || ''}`;
        const result = await checkoutService(strapi).handleWebhook(gateway, {
            body: ctx.request.body || {},
            query: ctx.query || {},
            headers: ctx.request.headers || {},
        });
        ctx.body = result;
    },
    async paymentReturn(ctx) {
        const gateway = `${ctx.params.gateway || ''}`;
        const result = await checkoutService(strapi).handleReturn(gateway, {
            body: ctx.request.body || {},
            query: ctx.query || {},
            headers: ctx.request.headers || {},
        });
        ctx.body = result;
    },
    async status(ctx) {
        const orderCode = `${ctx.params.orderCode || ''}`;
        if (!orderCode) {
            return ctx.badRequest('Missing orderCode');
        }
        const result = await checkoutService(strapi).getOrderStatus(orderCode);
        ctx.body = result;
    },
};
