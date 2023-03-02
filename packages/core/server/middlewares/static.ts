import { createReadStream, readFileSync, stat } from 'node:fs';
import { extname, join } from 'node:path';
import type { Middlewares } from '.';

export const alias: Record<string, string | undefined> = {
  js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json'
};

export const staticPlugin: Middlewares = ({ req, res, rootDir }, next) => {
  if (rootDir) {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      const view = readFileSync(join(rootDir, './view/index.html'));
      res.end(view);
      return;
    }
    const filePath = join(rootDir, '/view/', req.url || '');
    stat(filePath, (err, stats) => {
      const type = extname(filePath).replace('.', '');
      res.writeHead(200, { 'Content-Type': `${alias[type] || type}` });
      if (err) {
        res.statusCode = 404;
        res.end(`404`);
        return;
      }
      if (stats.isFile()) {
        res.statusCode = 200;
        createReadStream(filePath).pipe(res);
      }
    });
  } else {
    next && next();
  }
};
