import type { Flow } from '@nova/types';
import { createFlow, runFlow } from '../flow';
import type { FlowManage } from '../flow/flow';
import type { CommitOrdering } from '../server/middlewares/git';
import { getGitCommits } from '../server/middlewares/git';
import type { WebSocketServer } from '../ws/ws';

export const customListener = (wss: WebSocketServer, flowManage: FlowManage) => {
  wss.on('nova-client:create-flow', async (flow: Flow) => {
    await createFlow(flow);
  });

  wss.on('nova-client:run-flow', async (flow: Flow) => {
    await runFlow(flow.alias);
  });
  wss.on('nova-client:get-commits', async () => {
    const commits = await getGitCommits(null, 100, true, true, ['origin'], [], true, true, 'date' as CommitOrdering);
    wss.send('nova:commits', JSON.stringify(commits));
  });
  wss.on('nova-client:get-flows', async () => {
    wss.send('nova:flows', flowManage.flows);
  });
};
