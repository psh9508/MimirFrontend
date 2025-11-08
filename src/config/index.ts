import devConfig from './config-dev';
import liveConfig from './config';

const isDev = import.meta.env.MODE === 'dev';

export const API_CONFIG = isDev ? devConfig : liveConfig;
export default isDev ? devConfig : liveConfig;