import type { Server } from 'node:http';
import type { WebSocket as WebSocketRaw } from 'ws';
import { WebSocketServer as WebSocketServerRaw } from 'ws';
import type { CustomPayload, InferCustomEventPayload, sugarPayload } from '@sugar/types';
import type { CommitOrdering } from '../server/middlewares/git';
import { getGitCommits } from '../server/middlewares/git';

export interface WebSocketClient {
  /**
   * Send event to the client
   */
  send(payload: sugarPayload): void;
  /**
   * Send custom event
   */
  send(event: string, payload?: CustomPayload['data']): void;
  /**
   * The raw WebSocket instance
   * @advanced
   */
  socket: WebSocketRaw;
}

export type WebSocketCustomListener<T> = (data: T, client: WebSocketClient) => void;

export interface WebSocketServer {
  /**
   * Get all connected clients.
   */
  clients: Set<WebSocketClient>;
  /**
   * Send custom event
   */
  send<T extends string>(event: T, payload?: InferCustomEventPayload<T>): void;
  /**
   * Disconnect all clients and terminate the server.
   */
  close(): Promise<void>;
  /**
   * Handle custom event emitted by `import.meta.hot.send`
   */
  on: {
    <T extends string>(event: T, listener: WebSocketCustomListener<InferCustomEventPayload<T>>): void;
  };
  /**
   * Unregister event listener.
   */
  off: {
    (event: string, listener: Function): void;
  };
}

const wsServerEvents = ['connection', 'error', 'message'];

export const setupWebSocket = (server: Server): WebSocketServer => {
  const clientsMap = new WeakMap<WebSocketRaw, WebSocketClient>();

  const customListeners = new Map<string, Set<WebSocketCustomListener<any>>>();

  const wss = new WebSocketServerRaw({ server });

  wss.on('connection', async (socket) => {
    socket.on('message', async (raw) => {
      if (!customListeners.size) return;
      let parsed: any;
      try {
        parsed = JSON.parse(String(raw));
      } catch {}
      if (!parsed || parsed.type !== 'custom' || !parsed.event) return;
      const listeners = customListeners.get(parsed.event);
      if (!listeners?.size) return;
      const client = getSocketClient(socket);
      listeners.forEach((listener) => listener(parsed.data, client));
    });
    const commits = await getGitCommits(null, 100, true, true, ['origin'], [], true, true, 'date' as CommitOrdering);

    socket.send(JSON.stringify({ type: 'connected', commits }));
  });

  wss.on('error', (e: Error & { code: string }) => {
    if (e.code === 'EADDRINUSE') {
      console.log('WebSocket server error: Port is already in use');
    } else {
      console.log(`WebSocket server error:\n${e.stack || e.message}`);
    }
  });

  function getSocketClient(socket: WebSocketRaw) {
    if (!clientsMap.has(socket)) {
      clientsMap.set(socket, {
        send: (...args) => {
          let payload: any;
          if (typeof args[0] === 'string') {
            payload = {
              type: 'custom',
              event: args[0],
              data: args[1]
            };
          } else {
            payload = args[0];
          }
          socket.send(JSON.stringify(payload));
        },
        socket
      });
    }
    return clientsMap.get(socket)!;
  }

  return {
    on: ((event: string, fn: () => void) => {
      if (wsServerEvents.includes(event)) wss.on(event, fn);
      else {
        if (!customListeners.has(event)) {
          customListeners.set(event, new Set());
        }
        customListeners.get(event)!.add(fn);
      }
    }) as WebSocketServer['on'],
    off: ((event: string, fn: () => void) => {
      if (wsServerEvents.includes(event)) {
        wss.off(event, fn);
      } else {
        customListeners.get(event)?.delete(fn);
      }
    }) as WebSocketServer['off'],

    get clients() {
      return new Set(Array.from(wss.clients).map(getSocketClient));
    },

    send(...args: any[]) {
      let payload: sugarPayload;
      if (typeof args[0] === 'string') {
        payload = {
          type: 'custom',
          event: args[0],
          data: args[1]
        };
      } else {
        payload = args[0];
      }

      if (payload.type === 'error' && !wss.clients.size) {
        // bufferedError = payload;
        return;
      }

      const stringified = JSON.stringify(payload);
      wss.clients.forEach((client) => {
        // readyState 1 means the connection is open
        if (client.readyState === 1) {
          client.send(stringified);
        }
      });
    },

    close() {
      return new Promise((resolve, reject) => {
        wss.clients.forEach((client) => {
          client.terminate();
        });
        wss.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  };
};
