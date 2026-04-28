"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@strapi/utils");
const payment_1 = require("../../../services/payment");
const utils_2 = require("../../../services/payment/utils");
const { ApplicationError, NotFoundError, ValidationError } = utils_1.errors;
const ALLOWED_GATEWAYS = ['momo', 'zalopay', 'vnpay'];
const toGateway = (value) => {
    const gateway = `${value || ''}`;
    if (!ALLOWED_GATEWAYS.includes(gateway)) {
        throw new ValidationError('Unsupported gateway');
    }
    return gateway;
};
const nowIso = () => new Date().toISOString();
const buildDefaultReturnUrl = (gateway) => `${(0, utils_2.getPublicBaseUrl)()}/api/checkout/return/${gateway}`;
const buildDefaultNotifyUrl = (gateway) => `${(0, utils_2.getPublicBaseUrl)()}/api/checkout/webhook/${gateway}`;
const mapOrderStatus = (status) => {
    if (status === 'paid') {
        return {
            payment_status: 'paid',
            status: 'paid',
            paid_at: nowIso(),
        };
    }
    if (status === 'failed') {
        return {
            payment_status: 'failed',
            status: 'cancelled',
        };
    }
    return {
        payment_status: 'pending',
        status: 'pending_payment',
    };
};
exports.default = ({ strapi }) => ({
    async createPayment({ orderId, gateway: rawGateway, returnUrl, }) {
        const id = Number(orderId);
        if (!id) {
            throw new ValidationError('Invalid orderId');
        }
        const gateway = toGateway(rawGateway);
        const provider = (0, payment_1.getPaymentProvider)(gateway);
        const order = await strapi.entityService.findOne('api::order.order', id, {
            populate: {
                items: true,
            },
        });
        if (!order) {
            throw new NotFoundError('Order not found');
        }
        const amount = Number(order.total || 0);
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new ValidationError('Order total must be greater than 0');
        }
        const notifyUrl = buildDefaultNotifyUrl(gateway);
        const gatewayReturnUrl = returnUrl || buildDefaultReturnUrl(gateway);
        const payment = await provider.createPayment({
            orderCode: order.order_code,
            amount,
            orderInfo: `Thanh toan don hang ${order.order_code}`,
            notifyUrl,
            returnUrl: gatewayReturnUrl,
            metadata: {
                orderId: order.id,
                orderCode: order.order_code,
                items: order.items || [],
            },
        });
        const transaction = await strapi.entityService.create('api::payment-transaction.payment-transaction', {
            data: {
                order: order.id,
                gateway,
                request_id: payment.requestId,
                gateway_transaction_id: payment.gatewayTransactionId || null,
                amount,
                currency: order.currency || 'VND',
                status: 'pending',
                payment_url: payment.paymentUrl || null,
                qr_url: payment.qrUrl || null,
                raw_request: payment.rawRequest || null,
                raw_response: payment.rawResponse || null,
            },
        });
        await strapi.entityService.update('api::order.order', order.id, {
            data: {
                payment_method: gateway,
                payment_status: 'pending',
                status: 'pending_payment',
                gateway_metadata: {
                    ...(order.gateway_metadata || {}),
                    last_transaction_id: transaction.id,
                    last_gateway: gateway,
                },
            },
        });
        return {
            ok: true,
            orderId: order.id,
            orderCode: order.order_code,
            gateway,
            transactionId: transaction.id,
            paymentUrl: payment.paymentUrl,
            qrUrl: payment.qrUrl,
            mockMode: process.env.PAYMENT_MOCK !== 'false',
        };
    },
    async handleWebhook(gatewayParam, verifyInput) {
        const gateway = toGateway(gatewayParam);
        const provider = (0, payment_1.getPaymentProvider)(gateway);
        const isValid = provider.verifySignature(verifyInput);
        if (!isValid) {
            return {
                ok: false,
                message: 'Invalid signature',
            };
        }
        const normalized = provider.normalizeWebhook(verifyInput);
        if (!normalized.orderCode) {
            throw new ValidationError('Missing orderCode in webhook payload');
        }
        const orders = await strapi.entityService.findMany('api::order.order', {
            filters: { order_code: { $eq: normalized.orderCode } },
            limit: 1,
        });
        const order = orders === null || orders === void 0 ? void 0 : orders[0];
        if (!order) {
            throw new NotFoundError(`Order ${normalized.orderCode} not found`);
        }
        let transactions = await strapi.entityService.findMany('api::payment-transaction.payment-transaction', {
            filters: {
                order: { id: { $eq: order.id } },
                gateway: { $eq: gateway },
            },
            sort: ['id:desc'],
            limit: 1,
        });
        let tx = transactions === null || transactions === void 0 ? void 0 : transactions[0];
        if (!tx) {
            tx = await strapi.entityService.create('api::payment-transaction.payment-transaction', {
                data: {
                    order: order.id,
                    gateway,
                    amount: Number(normalized.amount || order.total || 0),
                    currency: order.currency || 'VND',
                    status: 'pending',
                },
            });
        }
        if (tx.status === 'paid' && normalized.status === 'paid') {
            return {
                ok: true,
                idempotent: true,
                orderCode: order.order_code,
            };
        }
        const orderStatusData = mapOrderStatus(normalized.status);
        await strapi.entityService.update('api::payment-transaction.payment-transaction', tx.id, {
            data: {
                gateway_transaction_id: normalized.gatewayTransactionId || tx.gateway_transaction_id,
                request_id: normalized.requestId || tx.request_id,
                amount: Number(normalized.amount || tx.amount || 0),
                status: normalized.status === 'paid' ? 'paid' : normalized.status === 'failed' ? 'failed' : 'pending',
                raw_webhook: normalized.raw || verifyInput.body || verifyInput.query,
                paid_at: normalized.status === 'paid' ? nowIso() : null,
                fail_reason: normalized.status === 'failed' ? normalized.message || 'Payment failed' : null,
            },
        });
        await strapi.entityService.update('api::order.order', order.id, {
            data: orderStatusData,
        });
        return {
            ok: true,
            orderCode: order.order_code,
            status: normalized.status,
            message: normalized.message,
        };
    },
    async handleReturn(gatewayParam, verifyInput) {
        const gateway = toGateway(gatewayParam);
        const provider = (0, payment_1.getPaymentProvider)(gateway);
        const normalized = provider.normalizeReturn(verifyInput);
        let order = null;
        if (normalized.orderCode) {
            const orders = await strapi.entityService.findMany('api::order.order', {
                filters: { order_code: { $eq: normalized.orderCode } },
                limit: 1,
            });
            order = (orders === null || orders === void 0 ? void 0 : orders[0]) || null;
        }
        return {
            ok: true,
            gateway,
            orderCode: normalized.orderCode,
            status: normalized.status,
            orderStatus: (order === null || order === void 0 ? void 0 : order.status) || null,
            paymentStatus: (order === null || order === void 0 ? void 0 : order.payment_status) || null,
            message: normalized.message || null,
            note: 'Use this endpoint for FE redirect handling. Real payment confirmation should rely on webhook.',
        };
    },
    async getOrderStatus(orderCode) {
        const orders = await strapi.entityService.findMany('api::order.order', {
            filters: { order_code: { $eq: orderCode } },
            populate: {
                transactions: true,
                items: true,
            },
            limit: 1,
        });
        const order = orders === null || orders === void 0 ? void 0 : orders[0];
        if (!order) {
            throw new NotFoundError(`Order ${orderCode} not found`);
        }
        return {
            ok: true,
            order: {
                id: order.id,
                orderCode: order.order_code,
                status: order.status,
                paymentStatus: order.payment_status,
                total: order.total,
                currency: order.currency,
            },
            transactions: (order.transactions || []).map((tx) => ({
                id: tx.id,
                gateway: tx.gateway,
                status: tx.status,
                requestId: tx.request_id,
                gatewayTransactionId: tx.gateway_transaction_id,
                amount: tx.amount,
                paidAt: tx.paid_at,
            })),
            items: (order.items || []).map((item) => ({
                id: item.id,
                productName: item.product_name,
                sku: item.sku,
                quantity: item.quantity,
                unitPrice: item.unit_price,
                lineTotal: item.line_total,
            })),
        };
    },
});
