import { get } from 'lodash'

export const common = {
  production: false,
  NODE_ENV: get(process, 'env.NODE_ENV', 'production'),
  ENV: get(process, 'env.NODE_ENV', 'production'),
  BUILD_TYPE: get(process, 'env.BUILD_TYPE', 'production'),
  PUBLIC_PROXY: get(process, 'env.PUBLIC_PROXY', '/oauth-api/publicproxy?url='),
  TERRABRASILIS_API_HOST: get(process, 'env.TERRABRASILIS_API_HOST', '/terrabrasilis/api/v1/'),
  TERRABRASILIS_BUSINESS_API_HOST: get(process, 'env.TERRABRASILIS_BUSINESS_API_HOST', '/business/api/v1/'),  
  AUTHENTICATION_RESOURCE_ROLE: get(process, 'env.AUTHENTICATION_RESOURCE_ROLE', 'terrabrasilis-user'),
  AUTHENTICATION_CLIENT_ID: get(process, 'env.AUTHENTICATION_CLIENT_ID', 'terrabrasilis-apps')
}
