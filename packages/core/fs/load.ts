import { existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { jsonParse, jsonStringify } from '../utils/json';
import { STORE_ROOT } from '../config/path';
export const loadJsonFile = async <T>(path: string): Promise<T | null> => {
  if (existsSync(path)) {
    const fileBuffer = await readFile(path, 'utf-8');
    if (fileBuffer) {
      try {
        return jsonParse(fileBuffer) as T;
      } catch (error) {
        return Promise.resolve(null);
      }
    }
    return Promise.resolve(null);
  }
  return Promise.resolve(null);
};

export const writeJsonFile = async (path: string, data: any) => {
  try {
    if (!existsSync(STORE_ROOT)) {
      mkdirSync(STORE_ROOT);
    }
    if (!existsSync(dirname(path))) {
      mkdirSync(dirname(path));
    }
    writeFile(path, jsonStringify(data, 4)).catch(() => {
      process.exit(0);
    });
    return Promise.resolve();
  } catch (error: any) {
    return Promise.reject(error);
  }
};
