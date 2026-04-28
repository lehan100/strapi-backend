"use strict";
/**
 * contact-submission router
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    routes: [
        {
            method: 'POST',
            path: '/contact-submissions',
            handler: 'contact-submission.createPublic',
            config: {
                auth: false,
            },
        },
    ],
};
