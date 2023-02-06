import type { Server } from 'node:http';
import { WebSocketServer } from 'ws';
import { getGitCommits } from './middlewares/gitManager';

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (socket) => {
    socket.on('message', (raw) => {
      let parsed: any;
      try {
        parsed = JSON.parse(String(raw));
      } catch {}
      console.log(parsed);
    });
    const commits = await getGitCommits();
    socket.send(JSON.stringify({ type: 'connected', commits }));
  });

  wss.on('error', (e: Error & { code: string }) => {
    if (e.code === 'EADDRINUSE') {
      console.log('WebSocket server error: Port is already in use');
    } else {
      console.log(`WebSocket server error:\n${e.stack || e.message}`);
    }
  });
  console.log(wss);
  return wss;
};
