import { green } from 'kolorist';
import { createLogger, printServerUrls } from '../logger/logger';

import { customListener } from '../event';
import { setupWebSocket } from '../ws/ws';
import { FlowManage } from '../flow/flow';
import { createServerCloseFn, httpServerStart, openBrowser, resolveHttpServer } from './http';
import { MiddlewaresServer } from './middlewares';
import { staticPlugin } from './middlewares/static';
import { baseMiddleware } from './middlewares/base';
import { errorPlugin } from './middlewares/error';

export const defaultServerConfig: sugarGitServerConfig = {
  rootdir: __dirname,
  port: 5124,
  host: 'localhost'
};

export interface sugarGitServerConfig {
  rootdir: string;
  port: number;
  host: string;
}

export const createServer = async ({ port, host, rootdir } = defaultServerConfig) => {
  const logger = createLogger();

  const middlewares = new MiddlewaresServer(rootdir);

  const httpServer = await resolveHttpServer(middlewares.init.bind(middlewares));

  const flowManage = new FlowManage();

  middlewares.use(baseMiddleware(rootdir));

  middlewares.use(staticPlugin);

  const wss = setupWebSocket(httpServer);

  customListener(wss, flowManage);

  middlewares.use(errorPlugin);

  const closeHttpServer = createServerCloseFn(httpServer);

  const printStart = (port: number) => {
    logger.clearScreen('error');
    console.log(`\n${green(`CGIT SERVER V1.0.0`)}\n`);
    printServerUrls(`http://${host}:${port}`);
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
