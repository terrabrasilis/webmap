import { get, merge } from 'lodash';
import { common } from './common'

export const environment = merge({}, common, {
	production: true,
	NODE_ENV: 'staging',
	ENV: 'staging',
	BUILD_TYPE: 'staging'
});
