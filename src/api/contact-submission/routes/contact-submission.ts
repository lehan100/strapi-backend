/**
 * contact-submission router
 */

export default {
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
