import type { Flow } from '@nova/types';
import { intro, isCancel, outro, select } from '@clack/prompts';
import { green } from 'kolorist';

import { createLogger } from '../logger/logger';
import { flows } from './default';
import { FlowManage } from './flow';
const logger = createLogger();

export const runFlow = async (flowName: string) => {
  let flow = flowName;
  const flowManage = new FlowManage();

  await flowManage.checkLoaded();
  if (!flow) {
    const options = flowManage.flows.map((x) => {
      return {
        label: `${x.name}(${x.alias})--${x.desc}`,
        value: x.alias
      };
    });
    const selectFlow = await select<{ label: string; value: string }[], string>({
      message: '选择需要执行的flow',
      options
    });
    if (isCancel(selectFlow)) {
      process.exit(0);
    }
    flow = selectFlow;
  }
  await flowManage.run(flow);
};

export const installFlow = async (name?: string) => {
  // TODO install remote
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
