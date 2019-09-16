import { get } from 'lodash'

export const common = {
  production: false,
  NODE_ENV: get(process, 'env.NODE_ENV', 'development'),
  ENV: get(process, 'env.NODE_ENV', 'development'),
  BUILD_TYPE: get(process, 'env.BUILD_TYPE', 'development'),
  INPE_PROXY: get(process, 'env.INPE_PROXY', ''),
  FIPCERRADO_OPERACAO: get(process, 'env.FIPCERRADO_OPERACAO', ''),
  PROXY_OGC: get(process, 'env.PROXY_OGC', ''),
  DASHBOARD_API_HOST: get(process, 'env.DASHBOARD_API_HOST', 'http://terrabrasilis.dpi.inpe.br/dashboard/api/v1/redis-cli/'),
  TERRABRASILIS_API_HOST: get(process, 'env.TERRABRASILIS_API_HOST', ''),
  TERRABRASILIS_BUSINESS_API_HOST: get(process, 'env.TERRABRASILIS_BUSINESS_API_HOST', '')
}
