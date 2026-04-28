import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  const hmrHost = process.env.STRAPI_ADMIN_HMR_HOST || 'localhost';
  const hmrClientPort = Number(process.env.STRAPI_ADMIN_HMR_CLIENT_PORT || '1337');

  return mergeConfig(config, {
    server: {
      allowedHosts: ['strapi.webcanhcam.vn', 'localhost', '127.0.0.1'],
      hmr: {
        protocol: 'ws',
        host: hmrHost,
        clientPort: hmrClientPort,
      },
    },
  });
};
