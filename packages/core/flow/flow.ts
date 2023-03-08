import { join } from 'node:path';
import type { Flow } from '@sugar/types';
import { spinner } from '@clack/prompts';
import { STORE_ROOT } from '../config/path';
import { loadJsonFile, writeJsonFile } from '../fs/load';
import { createLogger } from '../logger/logger';

const flowConfigPath = `${join(STORE_ROOT, `flows.json`)}`;

export interface FlowDesc {
  name: string;
  alias: string;
  desc: string;
}

export class FlowManage {
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
  }

  check(name: string) {
    return this._flows.some((x) => x.alias === name);
  }

  async find(name: string): Promise<Flow | null> {
    if (this.check(name)) {
      const flow = await loadJsonFile<Flow>(join(STORE_ROOT, `${name}.json}`)).catch(() => {});
      if (flow) return flow;
      return null;
    }
    return null;
  }

  async update(name: string, flow: Flow) {
    if (this.check(name)) {
      this._flows.forEach((x) => {
        if (x.alias === name) {
          x.desc = flow.desc;
          x.name = flow.name;
        }
      });
      await this.storageSave(flow);
    }
  }

  async delete() {}

  async add(flow: Flow) {
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
