import type { Flow } from '@sugar/types';
import { createFlow, runFlow } from '../flow';
import type { WebSocketServer } from '../ws/ws';

export const customListener = (wss: WebSocketServer) => {
  wss.on('sugar:create-flow', async (flow: Flow) => {
    await createFlow(flow);
  });

  wss.on('sugar:run-flow', async (flow: Flow) => {
    await runFlow(flow.alias);
  });
};
