import type { StrapiApp } from '@strapi/strapi/admin';
import { TextField } from '@strapi/icons/symbols';

export default {
  register(app: StrapiApp) {
    app.customFields.register({
      name: 'tinymce',
      type: 'richtext',
      intlLabel: {
        id: 'global.tinymce.label',
        defaultMessage: 'TinyMCE Editor',
      },
      intlDescription: {
        id: 'global.tinymce.description',
        defaultMessage: 'Rich text editor powered by TinyMCE',
      },
      icon: TextField,
      components: {
        Input: async () => import('./components/TinyMCEInput'),
      },
    });
  },
};
