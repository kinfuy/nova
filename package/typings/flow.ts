export interface Action {
  command: string;
  args: Array<string>;
}
export interface Flow {
  name: string;
  alias: string;
  desc: string;
  actions: Action[];
}
