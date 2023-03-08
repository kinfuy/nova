import type { Flow } from '@sugar/types';
import { createFlow, runFlow } from '../flow';
import type { FlowManage } from '../flow/flow';
import type { CommitOrdering } from '../server/middlewares/git';
import { getGitCommits } from '../server/middlewares/git';
import type { WebSocketServer } from '../ws/ws';

export const customListener = (wss: WebSocketServer, flowManage: FlowManage) => {
  wss.on('sugar-client:create-flow', async (flow: Flow) => {
    await createFlow(flow);
  });

  wss.on('sugar-client:run-flow', async (flow: Flow) => {
    await runFlow(flow.alias);
  });
  wss.on('sugar-client:get-commits', async () => {
    const commits = await getGitCommits(null, 100, true, true, ['origin'], [], true, true, 'date' as CommitOrdering);
    wss.send('sugar:commits', JSON.stringify(commits));
  });
  wss.on('sugar-client:get-flows', async () => {
    wss.send('sugar:flows', flowManage.flows);
  });
};
