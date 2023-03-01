import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
export const loadJsonFile = async <T>(path): Promise<T | null> => {
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
