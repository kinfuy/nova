import { join } from 'path';
import type { Action, Flow, FlowContent, ParamsAction, ShellAction } from '@sugar/types';
import { confirm, intro, multiselect, outro, select, spinner, text } from '@clack/prompts';
import { green } from 'kolorist';
import { loadJsonFile, writeJsonFile } from '../fs/load';
import { execCommand } from '../utils/shell';
import { STORE_ROOT } from '../config/path';
import { createLogger } from '../logger/logger';
import { flows } from './default';
const logger = createLogger();

export const isShellAction = (action: Action): action is ShellAction => {
  return action.type === 'shell';
};

export const isParamsAction = (action: Action): action is ParamsAction => {
  return action.type === 'params';
};

export const getArgs = (args: string[] | ((ctx: FlowContent) => string[]), ctx?: FlowContent) => {
  if (typeof args === 'function') {
    return args.call(ctx, ctx || { var: {} });
  }
  return args;
};

export const runFlow = async (flowName: string) => {
  if (!flowName) {
    logger.warn('need a flow name');
    return;
  }

  const flow = await loadJsonFile<Flow>(join(STORE_ROOT, `flows/${flowName}.json`)).catch(() => {
    logger.error(`${flowName} is not a flow`);
  });
  if (!flow) {
    logger.error(`${flowName} is not a flow`);
    return;
  }

  logger.clearScreen('error');

  function setContent(type: string, obj: object) {
    if (!flow) return;
    if (type === 'var') {
      if (flow.content) {
        Object.assign(flow.content.var, obj);
      } else {
        flow.content = {
          var: obj
        };
      }
    }
  }

  if (flow.alias === flowName) {
    intro(`flow: run ${flow.name}`);
    const startTime = performance.now();
    for (let i = 0; i < flow.actions.length; i++) {
      const s = spinner();
      const action = flow.actions[i];
      if (isShellAction(action)) {
        s.start(`action: ${action.command} ${getArgs(action.args, flow.content).join(' ')}`);
        if (action.before) action.before(flow.content || { var: {} });
        const rst = await execCommand(action.command, getArgs(action.args, flow.content)).finally(() => {
          s.stop(`action: ${action.command} ${getArgs(action.args, flow.content).join(' ')}`);
        });
        if (action.catch) {
          const value = action.transform ? action.transform(rst) : rst;

          setContent('var', {
            [action.catch]: value
          });
        }
        if (action.after) action.after(flow.content || { var: {} });
      }
      if (isParamsAction(action)) {
        if (action.before) action.before(flow.content || { var: {} });
        let value;
        if (action.params.type === 'input') {
          value = await text({
            message: action.params.message
          });
        }
        if (action.params.type === 'confirm') {
          value = await confirm({
            message: action.params.message
          });
        }
        if (action.params.type === 'select') {
          value = await select({
            message: action.params.message,
            options: action.params.options
          });
        }
        if (action.params.type === 'multiselect') {
          value = await multiselect({
            message: action.params.message,
            options: action.params.options
          });
        }
        setContent('var', {
          [action.name]: value
        });
        if (action.after) action.after(flow.content || { var: {} });
      }
    }
    const time = performance.now() - startTime;
    outro(`flow success ${green(`【${Math.floor(time)}ms】`)}`);
  }
};

export const installFlow = async (name?: string) => {
  logger.clearScreen('error');
  intro(`flow: insatll`);
  const startTime = performance.now();
  if (!name) {
    for (let i = 0; i < flows.length; i++) {
      const s = spinner();
      s.start(`install ${flows[i].name}`);
      await writeJsonFile(join(STORE_ROOT, `flows/${flows[i].alias}.json`), flows[i]).catch((err) => {
        logger.error(err);
      });
      s.stop(`${flows[i].name} install success`);
    }
    const time = performance.now() - startTime;
    outro(`flow success ${green(`【${Math.floor(time)}ms】`)}`);
  }
};

export const createFlow = async (flow: Flow) => {
  intro(`flow: create ${flow.name}`);
  const startTime = performance.now();
  const configDir = `${join(STORE_ROOT, `/flows/${flow.alias}.json`)}`;
  const s = spinner();
  s.start('createing');
  await writeJsonFile(configDir, flow).catch((err) => {
    logger.error(err);
  });
  s.stop('flow create success');
  const time = performance.now() - startTime;
  outro(`flow success ${green(`【${Math.floor(time)}ms】`)}`);
};
