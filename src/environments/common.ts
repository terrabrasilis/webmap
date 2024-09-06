import { get } from 'lodash'

export const common = {
  production: false,
  NODE_ENV: get(process, 'env.NODE_ENV', 'production'),
  ENV: get(process, 'env.NODE_ENV', 'production'),
  BUILD_TYPE: get(process, 'env.BUILD_TYPE', 'production'),
  PROXY_GETCAPABILITIES: get(process, 'env.PROXY_GETCAPABILITIES', '/oauth-api/getcapabilities?url='),
  TERRABRASILIS_API_HOST: get(process, 'env.TERRABRASILIS_API_HOST', '/terrabrasilis/api/v1/'),
  TERRABRASILIS_BUSINESS_API_HOST: get(process, 'env.TERRABRASILIS_BUSINESS_API_HOST', '/business/api/v1/'),
  AUTHENTICATION_PROXY_HOST: get(process, 'env.AUTHENTICATION_PROXY_HOST', '/oauth-api/proxy?url=')
}
