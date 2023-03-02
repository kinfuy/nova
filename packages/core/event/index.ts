import type { Flow } from '@clown/types/dist';
import { createFlow, runFlow } from '../flow';
import type { WebSocketServer } from '../ws/ws';

export const customListener = (wss: WebSocketServer) => {
  wss.on('clown:create-flow', async (flow: Flow) => {
    await createFlow(flow);
  });

  wss.on('clown:run-flow', async (flow: Flow) => {
    await runFlow(flow.alias);
  });
};
