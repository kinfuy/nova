import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { lightBlue } from 'kolorist';
import { getName, getSvgFiles } from './generate';
import { originSvgPath } from './utils/path';

const transformSvg = async (file: string) => {
  let originContent = await readFile(file, 'utf-8');
  const { filename } = getName(file);
  const index = originContent.indexOf('<svg');
  if (index !== -1) {
    originContent = originContent.slice(index);
    originContent = originContent.replace(/fill="#[\S]*"/g, () => `fill="currentColor"`);
    originContent = originContent.replace(/\\<style\\>[\s\S]*\\<\/style\\>/g, '');
    await writeFile(resolve(originSvgPath, `${filename}.svg`), originContent, 'utf-8');
  }
};
export const preTreatmentSvg = async () => {
  console.info(lightBlue('preTreatmentSvg...'));
  const files = await getSvgFiles();
  await Promise.all(files.map((file) => transformSvg(file)));
};
