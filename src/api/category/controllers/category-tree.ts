import {
  makeCategoryMenu,
  makeBreadcrumbByDocumentId,
  makeBreadcrumbBySlug,
} from "../units/category-tree";

export default ({ strapi }: { strapi: any }) => ({
  async menu(ctx: any) {
    const { position } = ctx.query;

    const categories = await strapi
      .service("api::category.category-tree")
      .findActiveCategoriesByPosition(position);

    const menu = makeCategoryMenu(categories);

    ctx.body = {
      data: menu,
    };
  },

  async breadcrumbByDocumentId(ctx: any) {
    const { documentId } = ctx.params;
    const { position } = ctx.query;

    const categories = await strapi
      .service("api::category.category-tree")
      .findActiveCategoriesByPosition(position);

    const breadcrumb = makeBreadcrumbByDocumentId(documentId, categories);

    ctx.body = {
      data: breadcrumb,
    };
  },

  async breadcrumbBySlug(ctx: any) {
    const { slug } = ctx.params;
    const { position } = ctx.query;

    const categories = await strapi
      .service("api::category.category-tree")
      .findActiveCategoriesByPosition(position);

    const breadcrumb = makeBreadcrumbBySlug(slug, categories);

    ctx.body = {
      data: breadcrumb,
    };
  },
});