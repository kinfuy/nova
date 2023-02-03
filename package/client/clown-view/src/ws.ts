export type HMRPayload = ConnectedPayload | CommandPayload | FullReloadPayload | ErrorPayload;

export interface ConnectedPayload {
  type: 'connected';
}

export interface CommandPayload {
  type: 'update';
  commands: [];
}

export interface FullReloadPayload {
  type: 'full-reload';
  path?: string;
}

export interface ErrorPayload {
  type: 'error';
  err: {};
}

export interface command {
  shell: string;
}

export const setupWebSocket = (protocol: string, hostAndPath: string, onCloseWithoutOpen?: () => void) => {
  const socket = new WebSocket(`${protocol}://${hostAndPath}`, 'vite-hmr');
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
    handleMessage(JSON.parse(data));
  });

  // ping server
  socket.addEventListener('close', async ({ wasClean }) => {
    if (wasClean) return;

    if (!isOpened && onCloseWithoutOpen) {
      onCloseWithoutOpen();
      return;
    }

    console.log(`[vite] server connection lost. polling for restart...`);
    location.reload();
  });

  return socket;
};

function handleMessage(payload: HMRPayload) {
  console.log('log=>ws=>90:payload:%o', payload);
}
