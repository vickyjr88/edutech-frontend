import { Configuration, FrontendApi } from '@ory/client-fetch';

const oryUrl = import.meta.env.VITE_ORY_SDK_URL || 'http://localhost:4000';

export const ory = new FrontendApi(
  new Configuration({
    basePath: oryUrl,
    baseOptions: {
      withCredentials: true,
    },
    headers: {
      Accept: 'application/json',
    },
  }),
);
