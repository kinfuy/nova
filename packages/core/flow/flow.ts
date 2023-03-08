import { join } from 'node:path';
import type { Flow } from '@sugar/types';
import { STORE_ROOT } from '../config/path';
import { loadJsonFile } from '../fs/load';

const flowConfigPath = `${join(STORE_ROOT, `flows.json`)}`;

export interface FlowDesc {
  name: string;
  alias: string;
  desc: string;
}

export class FlowManage {
  private _flows: FlowDesc[] = [];
  constructor() {
    this.load();
  }

  async load() {
    const flows = await loadJsonFile<FlowDesc[]>(flowConfigPath).catch(() => {});
    if (flows) this._flows = flows;
  }

  check(name: string) {
    return this._flows.some((x) => (x.alias = name));
  }

  async find(name: string): Promise<Flow | null> {
    if (this.check(name)) {
      const flow = await loadJsonFile<Flow>(join(STORE_ROOT, `${name}.json}`)).catch(() => {});
      if (flow) return flow;
      return null;
    }
    return null;
  }

  update(name: string, flow: Flow) {
    if (this.check(name)) {
      this._flows.forEach((x) => {
        if (x.alias === name) {
          x.alias = flow.alias;
        }
      });
      this.storageSave();
    }
  }

  delete() {}
  add(flow: Flow) {
    if (this.check(flow.alias)) {
      this.update(flow.alias, flow);
    } else {
      this._flows.push({
        alias: flow.alias,
        name: flow.name,
        desc: flow.desc
      });
    }
  }

  storageSave() {}
}
