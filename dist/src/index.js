"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    register({ strapi }) {
        strapi.customFields.register({
            name: 'tinymce',
            type: 'richtext',
        });
    },
    bootstrap() { },
};
