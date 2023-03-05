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

export const runFlow = async (flow: string) => {
  if (!flow) {
    logger.warn('need flow name!');
  }
  logger.clearScreen('error');
  const _flow = await loadJsonFile<Flow>(join(STORE_ROOT, `flows/${flow}.json`)).catch(() => {
    logger.error('not found flow');
  });

  function setContent(type: string, obj: object) {
    if (!_flow) return;
    if (type === 'var') {
      if (_flow.content) {
        Object.assign(_flow.content.var, obj);
      } else {
        _flow.content = {
          var: obj
        };
      }
    }
  }
  if (flow) {
    // eslint-disable-next-line no-restricted-syntax
    debugger;
    if (_flow?.alias === flow) {
      intro(`flow: run ${_flow.name}`);
      const startTime = new Date().getTime();
      for (let i = 0; i < _flow.actions.length; i++) {
        const s = spinner();
        const action = _flow.actions[i];
        if (isShellAction(action)) {
          s.start(`action: ${action.command} ${getArgs(action.args, _flow.content).join(' ')}`);
          if (action.before) action.before(_flow.content || { var: {} });
          const rst = await execCommand(action.command, getArgs(action.args, _flow.content)).finally(() => {
            s.stop(`action: ${action.command} ${getArgs(action.args, _flow.content).join(' ')}`);
          });
          if (action.catch) {
            const value = action.transform ? action.transform(rst) : rst;

            setContent('var', {
              [action.catch]: value
            });
          }
          if (action.after) action.after(_flow.content || { var: {} });
        }
        if (isParamsAction(action)) {
          if (action.before) action.before(_flow.content || { var: {} });
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
          if (action.after) action.after(_flow.content || { var: {} });
        }
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
