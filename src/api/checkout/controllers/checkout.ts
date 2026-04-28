type Ctx = {
  params: Record<string, any>;
  query: Record<string, any>;
  request: {
    body: Record<string, any>;
    headers: Record<string, any>;
  };
  body: unknown;
  badRequest: (message: string, details?: unknown) => void;
};

const checkoutService = (strapi: any) => strapi.service('api::checkout.checkout');

export default {
  async createPayment(ctx: Ctx) {
    const { orderId, gateway, returnUrl } = ctx.request.body || {};
    const result = await checkoutService(strapi).createPayment({
      orderId,
      gateway,
      returnUrl,
    });
    ctx.body = result;
  },

  async webhook(ctx: Ctx) {
    const gateway = `${ctx.params.gateway || ''}`;
    const result = await checkoutService(strapi).handleWebhook(gateway, {
      body: ctx.request.body || {},
      query: ctx.query || {},
      headers: ctx.request.headers || {},
    });
    ctx.body = result;
  },

  async paymentReturn(ctx: Ctx) {
    const gateway = `${ctx.params.gateway || ''}`;
    const result = await checkoutService(strapi).handleReturn(gateway, {
      body: ctx.request.body || {},
      query: ctx.query || {},
      headers: ctx.request.headers || {},
    });
    ctx.body = result;
  },

  async status(ctx: Ctx) {
    const orderCode = `${ctx.params.orderCode || ''}`;
    if (!orderCode) {
      return ctx.badRequest('Missing orderCode');
    }

    const result = await checkoutService(strapi).getOrderStatus(orderCode);
    ctx.body = result;
  },
};
