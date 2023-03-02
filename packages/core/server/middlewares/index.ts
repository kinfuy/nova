import type { IncomingMessage, ServerResponse } from 'node:http';

export interface MiddlewaresContent {
  req: IncomingMessage;
  res: ServerResponse;
  rootDir?: string;
  content?: any;
}
export type Middlewares = (ctx: MiddlewaresContent, next?: Function) => void;

export class MiddlewaresServer {
  rootdir: string | undefined;
  middlewares: Middlewares[];
  constructor(_rootdir?: string) {
    this.rootdir = _rootdir;
    this.middlewares = [];
  }

  use(middleware: Middlewares) {
    this.middlewares.push(middleware);
  }

  init(req: IncomingMessage, res: ServerResponse) {
    const ctx = { req, res };
    this.compose(ctx);
  }

  compose(ctx: MiddlewaresContent) {
    const dispatch = (index: number) => {
      if (index === this.middlewares.length) return Promise.resolve();
      const middleware = this.middlewares[index];
      return Promise.resolve(middleware(ctx, () => dispatch(index + 1)));
    };
    return dispatch(0);
  }
}
