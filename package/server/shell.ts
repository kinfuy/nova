import { cwd } from 'node:process';
import { spawn } from 'node:child_process';
import execa from 'execa';
export const execCommand = async (cmd: string, args: string[]) => {
  const res = await execa(cmd, args);
  return res.stdout.trim();
};

export const run = (command: string, dir: string = cwd()) => {
  const [cmd, ...args] = command.split(' ');
  return new Promise<void>((resolve, reject) => {
    const app = spawn(cmd, args, {
      cwd: dir,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });
    const processExit = () => app.kill('SIGHUP');

    app.on('close', (code) => {
      process.removeListener('exit', processExit);
      if (code === 0) resolve();
      else reject(new Error(`command failed: \n command:${cmd} \n code:${code}`));
    });
    process.on('exit', processExit);
  });
};
