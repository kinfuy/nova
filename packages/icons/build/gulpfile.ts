import { parallel, series } from 'gulp';
import { run, withTask } from '@alqmc/build-utils';
import { buildIcon } from './build';
import { copyconfigFile } from './copyFile';
import { buildSvgVue } from './generate';
import { preTreatmentSvg } from './preTreatmentSvg';
export default series(
  preTreatmentSvg, // 预处理svg，有新加入svg执行一次
  withTask('clean', () => run('pnpm run clean')),
  buildSvgVue,
  parallel(
    buildIcon,
    withTask('build:types', () => run('pnpm build:types'))
  ),
  copyconfigFile
);
