import { setupWebSocket } from '../ws';
let ws: WebSocket | null = null;
export const useWebSocket = () => {
  if (import.meta.env.VITE_APP_MODE === 'CLIENT_ONLY') return;
  if (ws) return ws;
  ws = setupWebSocket('ws', 'localhost:5124');
  return ws;
};
