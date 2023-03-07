import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import { emptyDir, mkdir } from 'fs-extra';
import camelcase from 'camelcase';
import glob from 'fast-glob';
import { format } from 'prettier';
import { log } from '@alqmc/build-utils';
import type { BuiltInParserName } from 'prettier';
import { buildOutpuPath, enterPath, enterSvgPath } from './utils/path';

export const getSvgFiles = async () => {
  const rootPath = path.resolve(__dirname, './../svg');
  return glob('*.svg', { cwd: rootPath, absolute: true });
};

export const getName = (file: string) => {
  const filename = path.basename(file).replace('.svg', '');
  const componentName = camelcase(filename, { pascalCase: true });
  return {
    filename,
    componentName
  };
};

const formatCode = (code: string, parser: BuiltInParserName = 'typescript') =>
  format(code, {
    parser,
    semi: false,
    singleQuote: true
  });

const transformToVueComponent = async (file: string) => {
  const content = await readFile(file, 'utf-8');
  const { filename, componentName } = getName(file);
  const vue = formatCode(
    `
<template>
${content}
</template>
<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    name: "${componentName}",
  })
</script>`,
    'vue'
  );
  writeFile(path.resolve(enterSvgPath, `${filename}.vue`), vue, 'utf-8');
};

const generateEntry = async (files: string[]) => {
  const code = formatCode(
    files
      .map((file) => {
        const { filename, componentName } = getName(file);
        return `export { default as ${componentName} } from './${filename}.vue'`;
      })
      .join('\n')
  );
  await writeFile(path.resolve(enterPath, './libs/index.ts'), code, 'utf-8');
};

const generateGlobalType = async (files: string[]) => {
  const code = files
    .map((file) => {
      const { componentName } = getName(file);
      return `${componentName}: typeof import('@sugar/icons')['${componentName}']`;
    })
    .join('\n');
  const globalType = formatCode(`declare module 'vue'{  export interface GlobalComponents {${code}}} export {};`);
  await mkdir(buildOutpuPath);
  await writeFile(path.resolve(buildOutpuPath, 'global.d.ts'), globalType, 'utf-8');
};
export const buildSvgVue = async () => {
  log.info('generating vue components');
  await emptyDir(enterSvgPath);
  const files = await getSvgFiles();
  log.info('generating vue files');
  await Promise.all(files.map((file) => transformToVueComponent(file)));
  log.info('generating entry file');
  await generateEntry(files);
  log.info('generating global.d.ts');
  await generateGlobalType(files);
};
