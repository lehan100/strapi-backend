"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBreadcrumbBySlug = exports.makeBreadcrumbByDocumentId = exports.makeCategoryMenu = exports.normalizeCategory = void 0;
const normalizeCategory = (item) => {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!item)
        return null;
    const parent = (_b = (_a = item.parent) !== null && _a !== void 0 ? _a : item.category) !== null && _b !== void 0 ? _b : null;
    return {
        documentId: item.documentId,
        name: (_c = item.name) !== null && _c !== void 0 ? _c : "",
        slug: (_d = item.slug) !== null && _d !== void 0 ? _d : "",
        active: item.active === true,
        parentDocumentId: (_e = parent === null || parent === void 0 ? void 0 : parent.documentId) !== null && _e !== void 0 ? _e : null,
        positions: Array.isArray(item.positions) ? item.positions : [],
        parent: parent
            ? {
                documentId: parent.documentId,
                name: (_f = parent.name) !== null && _f !== void 0 ? _f : "",
                slug: (_g = parent.slug) !== null && _g !== void 0 ? _g : "",
                active: parent.active === true,
            }
            : null,
    };
};
exports.normalizeCategory = normalizeCategory;
const groupByParent = (categories) => {
    var _a;
    const grouped = new Map();
    for (const category of categories) {
        const key = (_a = category.parentDocumentId) !== null && _a !== void 0 ? _a : null;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(category);
    }
    return grouped;
};
const buildMenuRecursive = (parentDocumentId, grouped) => {
    const children = grouped.get(parentDocumentId) || [];
    return children.map((item) => ({
        ...item,
        children: buildMenuRecursive(item.documentId, grouped),
    }));
};
const makeCategoryMenu = (categories) => {
    const normalized = categories
        .map(exports.normalizeCategory)
        .filter((item) => item !== null && item.active);
    const grouped = groupByParent(normalized);
    return buildMenuRecursive(null, grouped);
};
exports.makeCategoryMenu = makeCategoryMenu;
const makeCategoryMap = (categories) => {
    const map = new Map();
    for (const category of categories) {
        map.set(category.documentId, category);
    }
    return map;
};
const buildBreadcrumbRecursive = (documentId, categoryMap, trail = []) => {
    const current = categoryMap.get(documentId);
    if (!current) {
        return trail;
    }
    const nextTrail = [
        {
            documentId: current.documentId,
            name: current.name,
            slug: current.slug,
        },
        ...trail,
    ];
    if (!current.parentDocumentId) {
        return nextTrail;
    }
    return buildBreadcrumbRecursive(current.parentDocumentId, categoryMap, nextTrail);
};
const makeBreadcrumbByDocumentId = (documentId, categories) => {
    const normalized = categories
        .map(exports.normalizeCategory)
        .filter((item) => item !== null && item.active);
    const categoryMap = makeCategoryMap(normalized);
    return buildBreadcrumbRecursive(documentId, categoryMap);
};
exports.makeBreadcrumbByDocumentId = makeBreadcrumbByDocumentId;
const makeBreadcrumbBySlug = (slug, categories) => {
    const normalized = categories
        .map(exports.normalizeCategory)
        .filter((item) => item !== null && item.active);
    const current = normalized.find((item) => item.slug === slug);
    if (!current) {
        return [];
    }
    const categoryMap = makeCategoryMap(normalized);
    return buildBreadcrumbRecursive(current.documentId, categoryMap);
};
exports.makeBreadcrumbBySlug = makeBreadcrumbBySlug;
