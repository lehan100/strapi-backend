/**
 * contact-submission controller
 */

type Ctx = {
  request: {
    body: Record<string, any>;
    headers: Record<string, any>;
    ip?: string;
  };
  body: unknown;
  status?: number;
  badRequest: (message: string, details?: unknown) => void;
};

const CONTACT_SUBMISSION_UID = 'api::contact-submission.contact-submission' as any;

const toStringOrEmpty = (value: unknown): string => `${value ?? ''}`.trim();

const normalizePayload = (rawPayload: Record<string, any>) => ({
  userType: toStringOrEmpty((rawPayload.userType ?? rawPayload.user_type) || 'client'),
  fullname: toStringOrEmpty(rawPayload.fullname ?? rawPayload.full_name),
  company: toStringOrEmpty(rawPayload.company),
  phone: toStringOrEmpty(rawPayload.phone),
  email: toStringOrEmpty(rawPayload.email).toLowerCase(),
  requirements: toStringOrEmpty(rawPayload.requirements),
  agreeTerms: Boolean(rawPayload.agreeTerms ?? rawPayload.agree_terms),
  source: toStringOrEmpty(rawPayload.source),
  pagePath: toStringOrEmpty(rawPayload.pagePath ?? rawPayload.page_path),
  locale: toStringOrEmpty(rawPayload.locale),
});

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default {
  async createPublic(ctx: Ctx) {
    const body = ctx.request.body || {};
    const rawData = body && typeof body.data === 'object' && body.data ? body.data : body;
    const payload = normalizePayload(rawData || {});

    const missingFields: string[] = [];
    if (!payload.fullname) missingFields.push('fullname');
    if (!payload.phone) missingFields.push('phone');
    if (!payload.email) missingFields.push('email');

    if (missingFields.length > 0) {
      return ctx.badRequest('Missing required fields', { missingFields });
    }

    if (!isEmail(payload.email)) {
      return ctx.badRequest('Invalid email');
    }

    if (!['candidate', 'client'].includes(payload.userType)) {
      payload.userType = 'client';
    }

    const userAgent = toStringOrEmpty(ctx.request.headers?.['user-agent']);
    const forwardedFor = toStringOrEmpty(ctx.request.headers?.['x-forwarded-for']);
    const ipAddress = forwardedFor || toStringOrEmpty(ctx.request.ip);

    const created = await (strapi.entityService as any).create(CONTACT_SUBMISSION_UID, {
      data: {
        ...payload,
        userType: payload.userType,
        company: payload.company || null,
        requirements: payload.requirements || null,
        source: payload.source || null,
        pagePath: payload.pagePath || null,
        locale: payload.locale || null,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });

    ctx.status = 201;
    ctx.body = {
      success: true,
      data: created,
    };
  },
};
