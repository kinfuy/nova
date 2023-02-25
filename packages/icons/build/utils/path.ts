import { resolve } from 'path';
export const rootpath = resolve(__dirname, '..', '..');

export const enterPath = resolve(rootpath, 'package');
export const buildOutpuPath = resolve(rootpath, 'dist');
export const originSvgPath = resolve(rootpath, 'svg');

export const enterSvgPath = resolve(enterPath, 'libs');
