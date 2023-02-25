import type { Server } from 'node:http';
import { WebSocketServer } from 'ws';
import type { Action } from '@clown/types';
import type { Logger } from './logger';
import type { CommitOrdering } from './middlewares/git';
import { getGitCommits } from './middlewares/git';
import { execCommand } from './shell';

export const setupWebSocket = (server: Server, logger: Logger) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (socket) => {
    socket.on('message', async (raw) => {
      let parsed: any;
      try {
        parsed = JSON.parse(String(raw));
        if (parsed.key === 'RUN_FLOW') {
          const actions: Action[] = parsed.flow.actions;
          logger.info(`flow => ${parsed.flow.name}`, { timestamp: true, clear: true });
          for (let i = 0; i < actions.length; i++) {
            await execCommand(actions[i].command, actions[i].args);
            logger.info(`action => ${actions[i].command} ${actions[i].args.join(' ')}`, { timestamp: true });
          }
        }
      } catch {
        
      }
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
