import { get } from 'lodash'

export const common = {
  production: false,
  NODE_ENV: JSON.stringify(get(process, 'env.NODE_ENV', 'development')),
  ENV: JSON.stringify(get(process, 'env.NODE_ENV', 'development')),
  BUILD_TYPE: JSON.stringify(get(process, 'env.BUILD_TYPE', 'development')),
  INPE_PROXY: JSON.stringify(get(process, 'env.INPE_PROXY', '')),
  FIPCERRADO_OPERACAO: JSON.stringify(get(process, 'env.FIPCERRADO_OPERACAO', '')),
  PROXY_OGC: JSON.stringify(get(process, 'env.PROXY_OGC', '')),
  DASHBOARD_API_HOST: JSON.stringify(get(process, 'env.DASHBOARD_API_HOST', '')),
  TERRABRASILIS_API_HOST: JSON.stringify(get(process, 'env.TERRABRASILIS_API_HOST', '')),
  TERRABRASILIS_BUSINESS_API_HOST: JSON.stringify(get(process, 'env.TERRABRASILIS_BUSINESS_API_HOST', ''))
}
