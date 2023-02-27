import type { ErrorPayload, FullReloadPayload } from './payload';

export interface CustomEventMap {
  'vite:beforeFullReload': FullReloadPayload;
  'vite:error': ErrorPayload;
  'vite:invalidate': InvalidatePayload;
}

export interface InvalidatePayload {
  path: string;
  message: string | undefined;
}

export type InferCustomEventPayload<T extends string> = T extends keyof CustomEventMap ? CustomEventMap[T] : any;
