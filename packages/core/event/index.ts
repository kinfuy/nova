import type { Flow } from '@sugar/types';
import { createFlow, runFlow } from '../flow';
import { flows } from '../flow/default';
import type { CommitOrdering } from '../server/middlewares/git';
import { getGitCommits } from '../server/middlewares/git';
import { jsonStringify } from '../utils/json';
import type { WebSocketServer } from '../ws/ws';

export const customListener = (wss: WebSocketServer) => {
  wss.on('suger-client:create-flow', async (flow: Flow) => {
    await createFlow(flow);
  });

  wss.on('suger-client:run-flow', async (flow: Flow) => {
    await runFlow(flow.alias);
  });
  wss.on('suger-client:get-commits', async () => {
    const commits = await getGitCommits(null, 100, true, true, ['origin'], [], true, true, 'date' as CommitOrdering);
    wss.send('suger:commits', JSON.stringify({ type: 'coustom', commits }));
  });
  wss.on('suger-client:get-flows', async () => {
    wss.send('suger:flows', jsonStringify({ type: 'coustom', flows }));
  });
};
