import type { Middlewares } from '.';

export const errorPlugin: Middlewares = ({ res, content }) => {
  if (content) {
    res.end(content);
  }
};
