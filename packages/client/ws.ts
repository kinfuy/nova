import { useCommit } from './store/useCommit';

export type WsPayload = ConnectedPayload | CommandPayload | FullReloadPayload | ErrorPayload | PingPayload;

export interface ConnectedPayload {
  type: 'connected';
  commits: any;
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
  const socket = new WebSocket(`${protocol}://${hostAndPath}`, 'clown');
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

    console.log(`[clown] server connection lost. polling for restart...`);
    location.reload();
  });

  return socket;
};

function handleMessage(payload: WsPayload, socket: WebSocket) {
  if (payload.type === 'connected') {
    const commitStore = useCommit();
    commitStore.setCommits(payload.commits);
    setInterval(() => {
      if (socket.readyState === socket.OPEN) {
        socket.send('{"type":"ping"}');
      }
    }, 10000 * 6);
  }
}
