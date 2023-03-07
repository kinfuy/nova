import { join } from 'node:path';
import type { Flow } from '@sugar/types';
import { STORE_ROOT } from '../config/path';
import { loadJsonFile } from '../fs/load';

const flowConfigPath = `${join(STORE_ROOT, `flows.json`)}`;

export interface FlowDesc {
  path: string;
  alias: string;
  create: string;
}

export class FlowManage {
  private _flows: Flow[] = [];
  private _flow_index: FlowDesc[] = [];
  constructor() {
    this.load();
  }

  async load() {
    const flows = await loadJsonFile<FlowDesc[]>(flowConfigPath).catch(() => {});
    if (flows) this._flow_index = flows;
  }

  find(name: string) {
    return this._flows.find((x) => (x.alias = name));
  }

  update(name: string, flow: Flow) {
    this._flows.forEach((x) => {
      if (x.alias === name) {
        x.actions = flow.actions;
        x.alias = flow.alias;
        x.content = flow.content;
        x.name = flow.name;
        x.desc = flow.desc;
      }
      this.storageSave();
    });
  }

  delete() {}
  add() {}
  storageSave() {}
}
