/**
 * This class is responsible to store all global variables to use in entire application and not duplicate code
 */
export class Constants {
    public static get TERRABRASILIS_MAPS_GWC(): string {
        return 'http://terrabrasilis.info/fip-service/gwc/service/wms';
    }

    public static get TERRABRASILIS_MAPS_WMS(): string {
        return 'http://terrabrasilis.info/fip-service/wms';
    }

    public static get FIPCERRADO_OPERACAO(): string {
        return 'http://fipcerrado.dpi.inpe.br:8080/fipcerrado-geoserver/terraamazon/wms';
    }

    public static get FEATURE_INFO_PARAMS(): string {
        const host = '{0}';
        const service = '/wms?SERVICE=WMS';
        const version = '&VERSION=1.1.1';
        const request = '&REQUEST=GetFeatureInfo';
        const layers = '&LAYERS={1}';
        const query = '&QUERY_LAYERS={2}';
        const style = '&STYLES=';
        const bbox = '&BBOX={3}';
        const count = '&FEATURE_COUNT=';
        const width = '&WIDTH={4}';
        const heigth = '&HEIGHT={5}';
        const format = '&FORMAT=';
        const infoFormat = '&INFO_FORMAT={6}';
        const srs = '&SRS=EPSG:4326';
        const x = '&X={7}';
        const y = '&Y={8}';

        return host + service + version + request + layers + query + style + bbox + count + width + heigth + format + infoFormat + srs + x + y;
    }

    public static get PROXY_OGC(): string {
        return 'http://terrabrasilis.dpi.inpe.br/proxy?url=';
    }

    public static get DASHBOARD_API_HOST(): string {
        return 'http://terrabrasilis.dpi.inpe.br/dashboard/api/v1/redis-cli/';
    }

    public static get DASHBOARD_BIOMES_COLORS(): string[] {
        const listColors: string[] = ['#339966', '#ffcc00', '#ffff99', '#ff6600', '#33cccc', '#66ff33'];
        return listColors;
    }

    public static get DASHBOARD_BIOMES_NAMES(): string[] {
        const listNames: string[] = ['amazon', 'atlantic', 'caatinga', 'cerrado', 'pampa', 'pantanal', 'legal_amazon'];
        return listNames;
    }

    public static get DASHBOARD_CERRADO_DUPLICATED_YEARS(): number[] {
        const duplicatedYears: number[] = [2002, 2004, 2006, 2008, 2010, 2012];
        return duplicatedYears;
    }

    public static get DASHBOARD_CERRADO_MAINTAINABLE_YEARS(): number[] {
        const maitanableYears: number[] = [2013, 2014, 2015, 2016, 2017, 2018];
        return maitanableYears;
    }

    public static get MAP_LEGEND_COLORS(): any[] {
        return ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026'];
    }

    public static get TERRABRASILIS_API_HOST(): string {
        return 'http://terrabrasilis.dpi.inpe.br/terrabrasilis/api/v1/';
    }

    public static get MAP_LEGEND_GRADES(): number {
        return 8;
    }

    public static get DASHBOARD_CERRADO_STATES(): any[] {
        return ['MATO GROSSO', 'MARANHÃO', 'PIAUÍ', 'BAHIA', 'MATO GROSSO DO SUL', 'GOIÁS', 'MINAS GERAIS', 'SÃO PAULO', 'PARANÁ', 'TOCANTINS', 'DISTRITO FEDERAL'];
    }

    public static get DASHBOARD_AMAZON_STATES(): any[] {
        return ['PARÁ', 'AMAZONAS', 'RORAIMA', 'ACRE', 'MATO GROSSO', 'RONDÔNIA', 'AMAPÁ', 'MARANHÃO', 'TOCANTINS'];
    }

    public static get DASHBOARD_LEGAL_AMAZON_STATES(): any[] {
        return ['PARÁ', 'AMAZONAS', 'RORAIMA', 'ACRE', 'MATO GROSSO', 'RONDÔNIA', 'AMAPÁ', 'MARANHÃO', 'TOCANTINS'];
    }

    public static get TERRABRASILIS_BUSINESS_API_HOST(): string {
        return (process.env.ENV == 'production') ? ('http://terrabrasilis.dpi.inpe.br/business/api/v1/') : ('http://terrabrasilis.dpi.inpe.br/business/api/v1/');
    }
}
