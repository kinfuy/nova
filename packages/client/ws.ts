import { jsonParse } from './utils/json';
import { useCommit } from './store/useCommit';
import { useFlow } from './store/useFlow';

export type WsPayload = ConnectedPayload | CustomPayload | CommandPayload | FullReloadPayload | ErrorPayload | PingPayload;

export interface ConnectedPayload {
  type: 'connected';
}

export type CustomEventType = 'nova:commits' | 'nova:flows';
export interface CustomPayload {
  type: 'custom';
  event: CustomEventType;
  data: any;
}

export interface CommandPayload {
  type: 'update';
  commands: [];
}

export interface FullReloadPayload {
  type: 'full-reload';
  path?: string;
}

export interface PingPayload {
  type: 'ping';
}

export interface ErrorPayload {
  type: 'error';
  err: {};
}

export interface command {
  shell: string;
}

export const setupWebSocket = (protocol: string, hostAndPath: string, onCloseWithoutOpen?: () => void): WebSocket => {
  const socket = new WebSocket(`${protocol}://${hostAndPath}`, 'nova');
  let isOpened = false;

  socket.addEventListener(
    'open',
    () => {
      isOpened = true;
    },
    { once: true }
  );

  // Listen for messages
  socket.addEventListener('message', async ({ data }) => {
    handleMessage(JSON.parse(data), socket);
  });

  // ping server
  socket.addEventListener('close', async ({ wasClean }) => {
    if (wasClean) return;

    if (!isOpened && onCloseWithoutOpen) {
      onCloseWithoutOpen();
      return;
    }

    console.log(`[nova] server connection lost. polling for restart...`);
    location.reload();
  });

  return socket;
};

function handleMessage(payload: WsPayload, socket: WebSocket) {
  // eslint-disable-next-line no-restricted-syntax
  debugger;
  if (payload.type === 'connected') {
    ping(socket);
  }
  if (payload.type === 'custom') {
    CustomEventListen(payload);
  }
}

function CustomEventListen(data: { event: CustomEventType; data: any }) {
  const value = typeof data.data === 'string' ? jsonParse(data.data) : data.data;
  if (data.event === 'nova:commits') {
    const commitStore = useCommit();
    commitStore.setCommits(value);
  }
  if (data.event === 'nova:flows') {
    const flow = useFlow();
    flow.setFlow(value);
  }
}

function ping(socket: WebSocket) {
  setInterval(() => {
    if (socket.readyState === socket.OPEN) {
      socket.send(
        JSON.stringify({
          type: 'ping'
        })
      );
    }
  }, 10000 * 6);
}
