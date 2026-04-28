"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = () => ({
    'content-releases': {
        enabled: false,
    },
    documentation: {
        enabled: true,
        config: {
            // Keep docs endpoint predictable across environments
            'x-strapi-config': {
                path: '/documentation',
            },
        },
    },
});
exports.default = config;
