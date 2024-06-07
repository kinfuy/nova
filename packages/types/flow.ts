export interface FlowContent {
  var: Record<string, any>;
}

export type ActionType = 'shell' | 'script' | 'params' | 'flow';
export interface BaseAction {
  before?: (ctx: FlowContent) => void;
  after?: (ctx: FlowContent) => void;
}

export interface ShellAction extends BaseAction {
  type: 'shell';
  command: string;
  args: string[] | ((ctx: FlowContent) => string[]);
  catch?: string;
  originOutput?: boolean;
  transform?: (rst: any) => any;
}

export interface ScriptAction extends BaseAction {
  type: 'script';
  run: () => void;
}

export interface FlowAction extends BaseAction {
  type: 'flow';
  name: string;
}

export type params = 'input' | 'select' | 'multiselect' | 'confirm' | 'content';

export interface InputParams {
  type: 'input';
  message: string;
}
export interface SelectParams {
  type: 'select';
  message: string;
  options: {
    label: string;
    value: string;
  }[];
}

export interface MultiselectParams {
  type: 'multiselect';
  message: string;
  options: {
    label: string;
    value: string;
  }[];
}
export interface ConfirmParams {
  type: 'confirm';
  message: string;
}

export interface ContentParams {
  type: 'content';
  name: string;
}
export interface ParamsAction extends BaseAction {
  type: 'params';
  params: InputParams | SelectParams | MultiselectParams | ConfirmParams | ContentParams;
  name: string;
}

export type Action = ShellAction | ScriptAction | ParamsAction | FlowAction;

export interface FlowDesc {
  name: string;
  alias: string;
  desc: string;
}

export interface Flow extends FlowDesc {
  actions: Action[];
  /**
   * flow 上下文
   */
  content?: FlowContent;
}
