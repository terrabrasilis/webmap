import { get, merge } from 'lodash';
import { common } from './common'

export const environment = merge({}, common, {
	production: true,
	NODE_ENV: 'production',
	ENV: 'production',
	BUILD_TYPE: 'production'
});
