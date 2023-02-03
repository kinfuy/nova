import { statSync } from 'node:fs';
import { join } from 'node:path';
import { execCommand } from './shell';

export const checkGitRepo = (): Boolean => {
  try {
    const stats = statSync(join(process.cwd(), '.git'));
    if (stats.isDirectory()) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const getCurrentGitBranch = async () => {
  return await execCommand('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
};
