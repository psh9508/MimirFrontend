import localConfig from './config';
import prodConfig from './config-prod';

const isProduction = import.meta.env.MODE === 'dev' || import.meta.env.MODE === 'live';

export const API_CONFIG = isProduction ? prodConfig : localConfig;
export default isProduction ? prodConfig : localConfig;