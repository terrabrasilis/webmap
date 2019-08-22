import {Geometry} from './geometry';
import {Properties} from './properties';

export class Feature {
    type: string;
    properties: Properties;
    geometry: Geometry;
}
