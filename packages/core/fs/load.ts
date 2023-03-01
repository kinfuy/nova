import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
export const loadJsonFile = async <T>(path: string): Promise<T | null> => {
  if (existsSync(path)) {
    const fileBuffer = await readFile(path, 'utf-8');
    if (fileBuffer) {
      try {
        return JSON.parse(fileBuffer) as T;
      } catch (error) {
        return Promise.resolve(null);
      }
    }
    return Promise.resolve(null);
  }
  return Promise.resolve(null);
};

export const writeJsonFile = async (path: string, data: any) => {
  writeFile(path, JSON.stringify(data, null, 4)).catch(() => {
    process.exit(0);
  });
};
