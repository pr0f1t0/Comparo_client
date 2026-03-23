export const environment = {
  production: false,
  gatewayUrl: 'http://localhost:80',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'comparo',
    clientId: 'comparo-client',
  },
api: {
  catalog:  '/api/v1/catalog',
  search:   '/api/v1/search',
  user:     '/api/v1/users',
  offer:    '/api/v1/offers',
  review:   '/api/v1/reviews',
  storage:  '/storage',
},
};
