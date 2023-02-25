import type { RequestListener } from 'node:http';
import { createReadStream, readFileSync, stat } from 'node:fs';
import { extname, join } from 'node:path';
import { green } from 'kolorist';
import { createLogger, printServerUrls } from './logger';
import { createServerCloseFn, httpServerStart, openBrowser, resolveHttpServer } from './http';
import { checkGitRepo } from './check';
import { setupWebSocket } from './ws';

const alias: Record<string, string | undefined> = {
  js: 'application/javascript',
  css: 'text/css',
  html: 'text/html',
  json: 'application/json'
};

export const defaultServerConfig: ClownGitServerConfig = {
  rootdir:__dirname,
  port: 5124,
  host: 'localhost'
};

export interface ClownGitServerConfig {
  rootdir:string,
  port: number;
  host: string;
}

export const createServer = async ({ port, host,rootdir } = defaultServerConfig) => {
  const httpServerOptions: RequestListener = (req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      const view = readFileSync(join(rootdir, './view/index.html'));
      res.end(view);
      return;
    }
    const filePath = join(rootdir, '/view/', req.url || '');
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

  if (!checkGitRepo()) {
    logger.clearScreen('error');
    logger.info(`\n${green(`CGIT SERVER V1.0.0`)}`);
    logger.error('\n    can‘t find git repo');
    return;
  }

  const httpServer = await resolveHttpServer(httpServerOptions);

  setupWebSocket(httpServer, logger);

  const closeHttpServer = createServerCloseFn(httpServer);

  const printStart = (port: number) => {
    logger.clearScreen('error');
    logger.info(`\n${green(`CGIT SERVER V1.0.0`)}\n`);
    printServerUrls(`http://${host}:${port}`, logger.info);
  };

  const server = {
    httpServer,
    listen: async () => {
      const serverPort = await httpServerStart(httpServer, {
        port,
        strictPort: false,
        host,
        logger
      });
      if (serverPort) {
        openBrowser(`http://${host}:${serverPort}`);
        printStart(serverPort);
      }
      return server;
    },
    close: async () => {
      closeHttpServer();
    }
  };

  return server;
};
