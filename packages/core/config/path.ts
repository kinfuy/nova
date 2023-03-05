import { join } from 'path';
export const HOME = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'] || '';

export const STORE_ROOT = join(HOME, '.sugar');
