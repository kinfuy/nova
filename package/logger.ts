import readline from "node:readline";
import type { RollupError } from "rollup";

import { cyan, red, yellow } from "kolorist";
export type LogType = "error" | "warn" | "info";
export type LogLevel = LogType | "silent";

export interface LogOptions {
  clear?: boolean;
  timestamp?: boolean;
}

export const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
};

export interface LogErrorOptions extends LogOptions {
  error?: Error | RollupError | null;
}

export interface Logger {
  info(msg: string, options?: LogOptions): void;
  warn(msg: string, options?: LogOptions): void;
  error(msg: string, options?: LogErrorOptions): void;
  clearScreen(type?: LogType): void;
}

function clearScreen() {
  const repeatCount = process.stdout.rows - 2;
  const blank = repeatCount > 0 ? "\n".repeat(repeatCount) : "";
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

export const createLogger = (): Logger => {
  return {
    info: (msg) => {
      console.log(cyan(`   ${msg}`));
    },
    warn: (msg) => {
      console.log(yellow(`   ${msg}`));
    },
    error: (msg) => {
      console.log(red(`   ${msg}`));
    },
    clearScreen: () => {
      clearScreen();
    },
  };
};

export const printServerUrls = (url: string, info: Logger["info"]) => {
  info(url);
};
