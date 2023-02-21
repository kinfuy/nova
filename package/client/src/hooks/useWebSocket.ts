import { setupWebSocket } from '../ws';
let ws: WebSocket | null = null;
export const useWebSocket = () => {
  if (ws) return ws;
  ws = setupWebSocket('ws', 'localhost:5124');
  return ws;
};
