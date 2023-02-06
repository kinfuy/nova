import type { Server } from 'node:http';
import { WebSocketServer } from 'ws';
import type { CommitOrdering } from './middlewares/git';
import { getGitCommits } from './middlewares/git';

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (socket) => {
    socket.on('message', (raw) => {
      let parsed: any;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        parsed = JSON.parse(String(raw));
      } catch {}
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

  return wss;
};
