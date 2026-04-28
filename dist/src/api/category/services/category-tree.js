"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ strapi }) => ({
    async findActiveCategoriesByPosition(position) {
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
        return categories.filter((category) => {
            if (!Array.isArray(category.positions)) {
                return false;
            }
            return category.positions.some((pos) => (pos === null || pos === void 0 ? void 0 : pos[position]) === true);
        });
    },
});
