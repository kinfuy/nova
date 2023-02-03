import type { RequestListener } from 'node:http';
import { createReadStream, readFileSync, stat } from 'node:fs';
import { extname, join } from 'node:path';
import { green, white } from 'kolorist';
import { createLogger, printServerUrls } from './logger';
import { createServerCloseFn, httpServerStart, openBrowser, resolveHttpServer } from './http';

const alias: Record<string, string | undefined> = {
  js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json'
};

export const createServer = async () => {
  const httpServerOptions: RequestListener = (req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      const view = readFileSync(join(__dirname, './view/index.html'));
      res.end(view);
      return;
    }
    const filePath = join(__dirname, '/view/', req.url || '');
    stat(filePath, (err, stats) => {
      const type = extname(filePath).replace('.', '');
      res.writeHead(200, { 'Content-Type': `${alias[type]}; charset=utf-8` });
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
  };

  const logger = createLogger();

  const httpServer = await resolveHttpServer(httpServerOptions);

  const closeHttpServer = createServerCloseFn(httpServer);

  const printStart = () => {
    logger.clearScreen();
    logger.info(`\n${green(`CGIT SERVER V1.0.0`)}`);
    printServerUrls(`\n   ${white('> Local: ')} http://localhost:8080`, logger.info);
  };

  const server = {
    httpServer,
    listen: async () => {
      await httpServerStart(httpServer, {
        port: 8080,
        strictPort: false,
        host: 'localhost',
        logger
      });
      openBrowser('http://localhost:8080');
      printStart();
      return server;
    },
    close: async () => {
      closeHttpServer();
    }
  };

  return server;
};
