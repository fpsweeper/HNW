import config from '../../auth_config.json';

const { domain, clientId, audience, apiUri, errorPath } = config as {
  domain: string;
  clientId: string;
  audience?: string;
  apiUri: string;
  errorPath: string;
};

export const environment = {
  production: true,
  auth: {
    domain,
    clientId,
    ...(audience && audience !== "YOUR_API_IDENTIFIER" ? { audience } : null),
    redirectUri: 'https://market8.club/market8profile',
    errorPath,
  },
  httpInterceptor: {
    allowedList: [`${apiUri}/*`],
  },
};
