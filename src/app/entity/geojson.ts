import {Feature} from './feature';

export class Geojson {
    type: string;
    name: string;
    active: boolean;
    features: Feature[];
}
