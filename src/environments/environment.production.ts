export const environment = {
  production: true,
  gatewayUrl: '',
  keycloak: {
    url: '${KEYCLOAK_URL}',
    realm: 'comparo',
    clientId: 'comparo-client',
  },
  api: {
    catalog: '/api/catalog',
    search: '/api/search',
    user: '/api/user',
    offer: '/api/offer',
    review: '/api/review',
    storage: '/storage',
  },
};
