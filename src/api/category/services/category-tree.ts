export default ({ strapi }: { strapi: any }) => ({
  async findActiveCategoriesByPosition(position?: string) {
    const categories = await strapi.documents("api::category.category").findMany({
      status: "published",
      filters: {
        active: {
          $eq: true,
        },
      },
      fields: ["name", "slug", "active"],
      populate: {
        category: {
          fields: ["name", "slug", "active"],
        },
        positions: true,
      },
      sort: ["order:asc", "name:asc"],
    });

    if (!position) {
      return categories;
    }

    return categories.filter((category: any) => {
      if (!Array.isArray(category.positions)) {
        return false;
      }

      return category.positions.some((pos: any) => pos?.[position] === true);
    });
  },
});
