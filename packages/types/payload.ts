export type ClownPayload = ConnectedPayload | FullReloadPayload | CustomPayload | ErrorPayload;

export interface ConnectedPayload {
  type: 'connected';
}

export interface FullReloadPayload {
  type: 'full-reload';
  path?: string;
}

export interface CustomPayload {
  type: 'custom';
  event: string;
  data?: any;
}

export interface ErrorPayload {
  type: 'error';
  err: {
    [name: string]: any;
    message: string;
    stack: string;
    id?: string;
    frame?: string;
    plugin?: string;
    pluginCode?: string;
    loc?: {
      file?: string;
      line: number;
      column: number;
    };
  };
}
