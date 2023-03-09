import type { Flow } from '@nova/types';
import { intro, outro } from '@clack/prompts';
import { green } from 'kolorist';

import { createLogger } from '../logger/logger';
import { flows } from './default';
import { FlowManage } from './flow';
const logger = createLogger();

export const runFlow = async (flowName: string) => {
  if (!flowName) {
    logger.warn('need a flow name');
  }
  const flowManage = new FlowManage();
  await flowManage.run(flowName);
};

export const installFlow = async (name?: string) => {
  const flowManage = new FlowManage();
  logger.clearScreen('error');
  const startTime = performance.now();
  if (!name) {
    intro(`flow: insatll`);
    for (let i = 0; i < flows.length; i++) {
      await flowManage.add(flows[i]);
    }
    const time = performance.now() - startTime;
    outro(`flow success ${green(`【${Math.floor(time)}ms】`)}`);
  }
};

export const createFlow = async (flow: Flow) => {
  const flowManage = new FlowManage();
  intro(`flow: create ${flow.name}`);
  const startTime = performance.now();
  flowManage.add(flow);
  const time = performance.now() - startTime;
  outro(`flow success ${green(`【${Math.floor(time)}ms】`)}`);
};
