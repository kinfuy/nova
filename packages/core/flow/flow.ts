import { join } from 'node:path';
import type { Action, Flow, FlowContent, FlowDesc, ParamsAction, ShellAction } from '@nova/types';
import { confirm, intro, isCancel, multiselect, outro, select, spinner, text } from '@clack/prompts';
import { green } from 'kolorist';
import { STORE_ROOT } from '../config/path';
import { loadJsonFile, writeJsonFile } from '../fs/load';
import { createLogger } from '../logger/logger';
import { execCommand } from '../utils/shell';

const flowConfigPath = `${join(STORE_ROOT, `flows.json`)}`;

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

export class FlowManage {
  private loaded = false;
  private _flows: FlowDesc[] = [];

  logger = createLogger();
  constructor() {
    this.load();
  }

  get flows() {
    return this._flows;
  }

  async load() {
    const flows = await loadJsonFile<FlowDesc[]>(flowConfigPath).catch(() => {});
    if (flows) this._flows = flows;
    this.loaded = true;
  }

  async checkLoaded() {
    if (!this.loaded) await this.load();
  }

  check(alias: string) {
    return this._flows.some((x) => x.alias === alias);
  }

  async run(alias: string) {
    if (!alias) {
      this.logger.warn('need a flow name');
      return;
    }
    await this.checkLoaded();
    const flow = await this.find(alias);

    if (flow) {
      this.logger.clearScreen('error');
      const setContent = (type: string, obj: object) => {
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
      };
      if (flow.alias === alias) {
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
              const valueText = await text({
                message: action.params.message
              });
              if (isCancel(valueText)) {
                process.exit(0);
              }
              value = valueText;
            }
            if (action.params.type === 'confirm') {
              const valueConfirm = await confirm({
                message: action.params.message
              });
              if (isCancel(valueConfirm)) {
                process.exit(0);
              }
              value = valueConfirm;
            }
            if (action.params.type === 'select') {
              const valueSelect = await select({
                message: action.params.message,
                options: action.params.options
              });
              if (isCancel(valueSelect)) {
                process.exit(0);
              }
              value = valueSelect;
            }
            if (action.params.type === 'multiselect') {
              const valueMultiselect = await multiselect({
                message: action.params.message,
                options: action.params.options
              });
              if (isCancel(valueMultiselect)) {
                process.exit(0);
              }
              value = valueMultiselect;
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
    } else {
      this.logger.warn(`${alias} not a flow name`);
    }
  }

  async find(alias: string): Promise<Flow | null> {
    await this.checkLoaded();
    if (this.check(alias)) {
      const flow = await loadJsonFile<Flow>(join(STORE_ROOT, `flows/${alias}.json`)).catch(() => {});
      if (flow) return flow;
      return null;
    }
    return null;
  }

  async update(alias: string, flow: Flow) {
    await this.checkLoaded();
    if (this.check(alias)) {
      this._flows.forEach((x) => {
        if (x.alias === alias) {
          x.desc = flow.desc;
          x.name = flow.name;
        }
      });
      await this.storageSave(flow);
    }
  }

  async delete() {}

  async add(flow: Flow) {
    await this.checkLoaded();
    if (this.check(flow.alias)) {
      await this.update(flow.alias, flow);
    } else {
      this._flows.push({
        alias: flow.alias,
        name: flow.name,
        desc: flow.desc
      });
      await this.storageSave(flow);
    }
  }

  async storageSave(flow: Flow) {
    try {
      const s = spinner();
      s.start(`install ${flow.name}`);
      await writeJsonFile(join(STORE_ROOT, `flows/${flow.alias}.json`), flow);
      await writeJsonFile(join(STORE_ROOT, `flows.json`), this.flows);
      s.stop(`${flow.name} install success`);
    } catch (error: any) {
      this.logger.error(error);
    }
  }
}
