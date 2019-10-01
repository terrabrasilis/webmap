import { get } from 'lodash'

export const common = {
  production: false,
  NODE_ENV: get(process, 'env.NODE_ENV', 'production'),
  ENV: get(process, 'env.NODE_ENV', 'production'),
  BUILD_TYPE: get(process, 'env.BUILD_TYPE', 'production'),
  INPE_PROXY: get(process, 'env.INPE_PROXY', 'http://terrabrasilis2.dpi.inpe.br:7000/cgi-bin/proxy.cgi?url='),
  FIPCERRADO_OPERACAO: get(process, 'env.FIPCERRADO_OPERACAO', 'http://fipcerrado.dpi.inpe.br:8080/fipcerrado-geoserver/terraamazon/wms'),
  PROXY_OGC: get(process, 'env.PROXY_OGC', 'http://terrabrasilis.dpi.inpe.br/proxy?url='),
  DASHBOARD_API_HOST: get(process, 'env.DASHBOARD_API_HOST', 'http://terrabrasilis.dpi.inpe.br/dashboard/api/v1/redis-cli/'),
  TERRABRASILIS_API_HOST: get(process, 'env.TERRABRASILIS_API_HOST', 'http://terrabrasilis.dpi.inpe.br/terrabrasilis/api/v1/'),
  TERRABRASILIS_BUSINESS_API_HOST: get(process, 'env.TERRABRASILIS_BUSINESS_API_HOST', 'http://terrabrasilis.dpi.inpe.br/business/api/v1/')
}
