import type { Core } from '@strapi/strapi';

const config = (): Core.Config.Plugin => ({
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

export default config;
