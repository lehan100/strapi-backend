"use strict";
/**
 * contact-submission controller
 */
Object.defineProperty(exports, "__esModule", { value: true });
const CONTACT_SUBMISSION_UID = 'api::contact-submission.contact-submission';
const toStringOrEmpty = (value) => `${value !== null && value !== void 0 ? value : ''}`.trim();
const normalizePayload = (rawPayload) => {
    var _a, _b, _c, _d;
    return ({
        userType: toStringOrEmpty(((_a = rawPayload.userType) !== null && _a !== void 0 ? _a : rawPayload.user_type) || 'client'),
        fullname: toStringOrEmpty((_b = rawPayload.fullname) !== null && _b !== void 0 ? _b : rawPayload.full_name),
        company: toStringOrEmpty(rawPayload.company),
        phone: toStringOrEmpty(rawPayload.phone),
        email: toStringOrEmpty(rawPayload.email).toLowerCase(),
        requirements: toStringOrEmpty(rawPayload.requirements),
        agreeTerms: Boolean((_c = rawPayload.agreeTerms) !== null && _c !== void 0 ? _c : rawPayload.agree_terms),
        source: toStringOrEmpty(rawPayload.source),
        pagePath: toStringOrEmpty((_d = rawPayload.pagePath) !== null && _d !== void 0 ? _d : rawPayload.page_path),
        locale: toStringOrEmpty(rawPayload.locale),
    });
};
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
exports.default = {
    async createPublic(ctx) {
        var _a, _b;
        const body = ctx.request.body || {};
        const rawData = body && typeof body.data === 'object' && body.data ? body.data : body;
        const payload = normalizePayload(rawData || {});
        const missingFields = [];
        if (!payload.fullname)
            missingFields.push('fullname');
        if (!payload.phone)
            missingFields.push('phone');
        if (!payload.email)
            missingFields.push('email');
        if (missingFields.length > 0) {
            return ctx.badRequest('Missing required fields', { missingFields });
        }
        if (!isEmail(payload.email)) {
            return ctx.badRequest('Invalid email');
        }
        if (!['candidate', 'client'].includes(payload.userType)) {
            payload.userType = 'client';
        }
        const userAgent = toStringOrEmpty((_a = ctx.request.headers) === null || _a === void 0 ? void 0 : _a['user-agent']);
        const forwardedFor = toStringOrEmpty((_b = ctx.request.headers) === null || _b === void 0 ? void 0 : _b['x-forwarded-for']);
        const ipAddress = forwardedFor || toStringOrEmpty(ctx.request.ip);
        const created = await strapi.entityService.create(CONTACT_SUBMISSION_UID, {
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
