import type * as net from 'node:net';
import type * as http from 'node:http';
import { exec } from 'child_process';
import type { Logger } from './logger';

export const resolveHttpServer = async (app: any) => {
  const { createServer } = await import('node:http');
  return createServer(app);
};

export const createServerCloseFn = (server: http.Server | null) => {
  if (!server) {
    return () => {};
  }

  let hasListened = false;
  const openSockets = new Set<net.Socket>();

  server.on('connection', (socket) => {
    openSockets.add(socket);
    socket.on('close', () => {
      openSockets.delete(socket);
    });
  });

  server.once('listening', () => {
    hasListened = true;
  });

  return () =>
    new Promise<void>((resolve, reject) => {
      openSockets.forEach((s) => s.destroy());
      if (hasListened) {
        server.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
};

export async function httpServerStart(
  httpServer: any,
  serverOptions: {
    port: number;
    strictPort: boolean | undefined;
    host: string | undefined;
    logger: Logger;
  }
): Promise<number> {
  let { port } = serverOptions;
  const { strictPort, host, logger } = serverOptions;

  return new Promise((resolve, reject) => {
    const onError = (e: Error & { code?: string }) => {
      if (e.code === 'EADDRINUSE') {
        if (strictPort) {
          httpServer.removeListener('error', onError);
          reject(new Error(`Port ${port} is already in use`));
        } else {
          logger?.info(`Port ${port} is in use, trying another one...`);
          httpServer.listen(++port, host);
        }
      } else {
        httpServer.removeListener('error', onError);
        reject(e);
      }
    };

    httpServer.on('error', onError);

    httpServer.listen(port, host, () => {
      httpServer.removeListener('error', onError);
      resolve(port);
    });
  });
}

export const openBrowser = (url: string, app = 'chrome') => {
  try {
    exec(`start ${app} ${url}`);
  } catch (error) {
    console.error(error);
  }
};
