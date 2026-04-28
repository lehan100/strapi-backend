"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: "GET",
            path: "/categories/menu-tree",
            handler: "category-tree.menu",
            config: {
                auth: false,
            },
        },
        {
            method: "GET",
            path: "/categories/breadcrumb/document/:documentId",
            handler: "category-tree.breadcrumbByDocumentId",
            config: {
                auth: false,
            },
        },
        {
            method: "GET",
            path: "/categories/breadcrumb/slug/:slug",
            handler: "category-tree.breadcrumbBySlug",
            config: {
                auth: false,
            },
        },
    ],
};
