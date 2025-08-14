import { Configuration, FrontendApi } from '@ory/kratos-client';

const kratosUrl = import.meta.env.VITE_KRATOS_PUBLIC_URL || 'http://127.0.0.1:4433';

export const ory = new FrontendApi(
  new Configuration({
    basePath: kratosUrl,
    baseOptions: {
      withCredentials: true,
    },
  }),
);
