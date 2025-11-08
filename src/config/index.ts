import localConfig from './config';
import prodConfig from './config-prod';

const isProduction = import.meta.env.MODE === 'dev' || import.meta.env.MODE === 'live';

console.log('Current MODE:', import.meta.env.MODE);
console.log('isProduction:', isProduction);
console.log('Selected config baseURL:', isProduction ? prodConfig.baseURL : localConfig.baseURL);

export const API_CONFIG = isProduction ? prodConfig : localConfig;
export default isProduction ? prodConfig : localConfig;