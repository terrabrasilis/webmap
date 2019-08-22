/**
 * Value Object to feed the view.
 */
export class Layer2View {
    name: string;
    title: string;
    metadata: string;
    url: string;
    namespace: string;
    constructor() {}
}

/**
 * Container class to store all properties from a WMS capabilities document.
 */
export class WmsServerCapabilities {
    service: ServiceDescription;
    request: RequestCapabilities;
    layers: LayerCapabilities;
    version: string;

    /**
     *
     * @param root
     * @param datasourceName Alternative to namespace fro each layer loaded from this host.
     */
    constructor(root: any, datasourceName: string) {
        if (root != undefined) {
            this.version = root.version;
            this.service = new ServiceDescription(root.service);
            this.request = new RequestCapabilities(root.capability.request);
            this.layers = new LayerCapabilities(root.capability.layer, datasourceName);
        }
    }
}

/**
 * Contains service metadata such as the service name, keywords, and contact information for the organization operating the server.
 */
export class ServiceDescription {
    title: string;
    abstract: string;
    keywords: string[];
    contact: ContactAddress;

    constructor(service: any) {
        this.title = service.title;
        this.abstract = service._abstract;
        const keywords = new Array();
        if (service.keywordList.keyword) {
            service.keywordList.keyword.forEach(function(it: any) {keywords.push(it.value); });
        }
        this.keywords = keywords;
        this.contact = new ContactAddress(service.contactInformation);
    }
}

/**
 * WMS ContactAddress informations
 */
export class ContactAddress {
    address: string;
    addressType: string;
    city: string;
    country: string;
    stateOrProvince: string;
    contactElectronicMailAddress: string;

    constructor(ca: any) {
        if (ca != undefined) {
            this.address = ca.contactAddress.address;
            this.addressType = ca.contactAddress.addressType;
            this.city = ca.contactAddress.city;
            this.country = ca.contactAddress.country;
            this.stateOrProvince = ca.contactAddress.stateOrProvince;
            this.contactElectronicMailAddress = ca.contactElectronicMailAddress;
        }
    }
}

/**
 * Describes the operations the WMS service provides and the parameters and output formats for each operation.
 * If desired GeoServer can be configured to disable support for certain WMS operations.
 */
export class RequestCapabilities {
    getmap: OnlineResource;
    getfeatureinfo: OnlineResource;

    constructor(request: any) {
        if (request != undefined) {
            this.getmap = new OnlineResource(request.getFeatureInfo.dcpType, request.getFeatureInfo.format);
            this.getfeatureinfo = new OnlineResource(request.getMap.dcpType, request.getMap.format);
        }
    }
}

/**
 * Generic online resource descriptor
 */
export class OnlineResource {
    href_get: string;
    formats: string[];

    constructor(resource: any, format: string[]) {
        if (resource != undefined) {
            if (resource.length) {
                if (resource[0].TYPE_NAME.indexOf('DCPType') >= 0) {
                    this.href_get = resource[0].http.get.onlineResource.href;
                    this.formats = format;
                } else if (resource[0].TYPE_NAME.indexOf('MetadataURL') >= 0) {
                    this.href_get = resource[0].onlineResource.href;
                    this.formats = [resource[0].format];
                }
            }
        }
    }
}

/**
 * Lists the available coordinate systems and layers. In GeoServer layers are named in the form “namespace:layer”.
 * Each layer provides service metadata such as title, abstract and keywords.
 */
export class LayerCapabilities {
    layers: WmsLayerCapabilities[];

    constructor(layer: any, datasourceName: string) {
        if (layer != undefined && layer.layer.length) {
            const layers = new Array();
            layer.layer.forEach(function(l: any) {
                layers.push(
                    new WmsLayerCapabilities(l, datasourceName)
                );
            });
            this.layers = layers;
        }
    }
}

/**
 * The primitives for display and manager WMS layers into view tier.
 */
export class WmsLayerCapabilities {
    name: string;
    title: string;
    namespace: string;
    dimension: Dimension[];
    bbox: BoundingBox[];
    default_projection: string;
    opaque: boolean;
    queryable: boolean;
    metadataURL: OnlineResource;

    constructor(layer: any, alternativeNameSpace: string) {
        this.namespace = this._tryFindNamespace(layer, alternativeNameSpace);
        this.name = ( (layer.name.indexOf(':') > 0) ? (layer.name.split(':')[1]) : (layer.name) );
        this.title = layer.title;
        this.opaque = layer.opaque;
        this.queryable = layer.queryable;
        this.metadataURL = new OnlineResource(layer.metadataURL, undefined);
        const bbox = new Array();
        layer.boundingBox.forEach(function(b: any) {
            bbox.push(
                new BoundingBox(b)
            );
        });
        this.bbox = bbox;
        const dimension = new Array();
        if (layer.dimension != undefined && layer.dimension.length) {
            layer.dimension.forEach(function(d: any) {
                dimension.push(
                    new Dimension(d)
                );
            });
            this.dimension = dimension;
        }
    }

    /**
     * Extract a namespace for a layer or alternative name from registered datasource.
     * If no exists, use the own layer name as namespace.
     *
     * @param layer The source values from capabilities that represents a WMS layer
     * @param alternativeNameSpace The alternative name when miss namespace from capabilities
     */
    private _tryFindNamespace(layer: any, alternativeNameSpace: string) {
        if (layer.name.indexOf(':') > 0) {
            return layer.name.split(':')[0];
        } else if (layer.style &&
            layer.style[0] &&
            layer.style[0].name &&
            layer.style[0].name.indexOf(':') > 0) {
            return layer.style[0].name.split(':')[0];
        } else if (alternativeNameSpace.length) {
            return alternativeNameSpace;
        }
        // by default use the layer name as namespace
        return layer.name;
    }
}

/**
 * Dimension default parameters
 */
export class Dimension {
    units: string;
    value: string[];
    default: string;
    constructor(dim: any) {
        this.units = dim.units;
        this.default = dim._default;
        const dimValues = dim.value.split(',');
        const val = new Array();
        dimValues.forEach(function(d: any) {
            val.push(d);
        });
        this.value = val;
    }
}

/**
 * Bounding Box default parameters
 */
export class BoundingBox {
    crs: string;
    maxx: number;
    maxy: number;
    minx: number;
    miny: number;

    constructor(bbox: any) {
        this.crs = bbox.crs;
        this.maxx = bbox.maxx;
        this.maxy = bbox.maxy;
        this.minx = bbox.minx;
        this.miny = bbox.miny;
    }
}
