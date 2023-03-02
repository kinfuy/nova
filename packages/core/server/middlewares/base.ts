import type { Middlewares } from '.';

export const baseMiddleware = (rootDir: string): Middlewares => {
  return (ctx, next) => {
    ctx.rootDir = rootDir;
    next && next();
  };
};
