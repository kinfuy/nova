import { join } from 'path';
import type { Flow } from '@clown/types/dist';
import { intro, outro, spinner } from '@clack/prompts';
import { green } from 'kolorist';
import { loadJsonFile, writeJsonFile } from '../fs/load';
import { execCommand } from '../utils/shell';
import { STORE_ROOT } from '../config/path';
import { createLogger } from '../logger/logger';
import { flows } from './default';
const logger = createLogger();

export const runFlow = async (flow: string) => {
  if (!flow) {
    logger.warn('need flow name!');
  }
  logger.clearScreen('error');
  const _flow = await loadJsonFile<Flow>(join(STORE_ROOT, `flows/${flow}.json`)).catch(() => {
    logger.error('not found flow');
  });
  if (flow) {
    if (_flow?.alias === flow) {
      intro(`flow: run ${_flow.name}`);
      const startTime = new Date().getTime();
      for (let i = 0; i < _flow.actions.length; i++) {
        const s = spinner();
        s.start(`action: ${_flow.actions[i].command} ${_flow.actions[i].args.join(' ')}`);
        await execCommand(_flow.actions[i].command, _flow.actions[i].args).finally(() => {
          s.stop(`action: ${_flow.actions[i].command} ${_flow.actions[i].args.join(' ')}`);
        });
      }
      const endTime = new Date().getTime() - startTime;
      outro(`flow success ${green(`【${Math.floor(endTime / 1000)}ms】`)}`);
    }
  } else {
    logger.error('not found flow');
  }
};

export const installFlow = async () => {
  logger.clearScreen('error');
  intro(`flow: insatll`);
  const startTime = new Date().getTime();
  for (let i = 0; i < flows.length; i++) {
    const s = spinner();
    s.start(`install ${flows[i].name}`);
    await writeJsonFile(join(STORE_ROOT, `flows/${flows[i].alias}.json`), flows[i]).catch((err) => {
      logger.error(err);
    });
    s.stop(`${flows[i].name} install success`);
  }
  const endTime = new Date().getTime() - startTime;
  outro(`flow success ${green(`【${Math.floor(endTime / 1000)}ms】`)}`);
};

export const createFlow = async (flow: Flow) => {
  intro(`flow: create ${flow.name}`);
  const startTime = new Date().getTime();
  const configDir = `${join(STORE_ROOT, `/flows/${flow.alias}.json`)}`;
  const s = spinner();
  s.start('createing');
  await writeJsonFile(configDir, flow).catch((err) => {
    logger.error(err);
  });
  s.stop('flow create success');
  const endTime = new Date().getTime() - startTime;
  outro(`flow success ${green(`【${Math.floor(endTime / 1000)}ms】`)}`);
};
