"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_tree_1 = require("../units/category-tree");
exports.default = ({ strapi }) => ({
    async menu(ctx) {
        const { position } = ctx.query;
        const categories = await strapi
            .service("api::category.category-tree")
            .findActiveCategoriesByPosition(position);
        const menu = (0, category_tree_1.makeCategoryMenu)(categories);
        ctx.body = {
            data: menu,
        };
    },
    async breadcrumbByDocumentId(ctx) {
        const { documentId } = ctx.params;
        const { position } = ctx.query;
        const categories = await strapi
            .service("api::category.category-tree")
            .findActiveCategoriesByPosition(position);
        const breadcrumb = (0, category_tree_1.makeBreadcrumbByDocumentId)(documentId, categories);
        ctx.body = {
            data: breadcrumb,
        };
    },
    async breadcrumbBySlug(ctx) {
        const { slug } = ctx.params;
        const { position } = ctx.query;
        const categories = await strapi
            .service("api::category.category-tree")
            .findActiveCategoriesByPosition(position);
        const breadcrumb = (0, category_tree_1.makeBreadcrumbBySlug)(slug, categories);
        ctx.body = {
            data: breadcrumb,
        };
    },
});
