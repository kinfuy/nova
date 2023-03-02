import readline from 'node:readline';
import type { RollupError } from 'rollup';

import { bold, cyan, dim, green, red, yellow } from 'kolorist';
export type LogType = 'error' | 'warn' | 'info';
export type LogLevel = LogType | 'silent';

export interface LogOptions {
  clear?: boolean;
  timestamp?: boolean;
}

export const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3
};

export interface LoggerOptions {
  prefix?: string;
  allowClearScreen?: boolean;
  customLogger?: Logger;
}

export interface LogErrorOptions extends LogOptions {
  error?: Error | RollupError | null;
}

export interface Logger {
  info(msg: string, options?: LogOptions): void;
  warn(msg: string, options?: LogOptions): void;
  warnOnce(msg: string, options?: LogOptions): void;
  error(msg: string, options?: LogErrorOptions): void;
  clearScreen(type: LogType): void;
  hasErrorLogged(error: Error | RollupError): boolean;
  hasWarned: boolean;
}

function clearScreen() {
  const repeatCount = process.stdout.rows - 2;
  const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : '';
  console.log(blank);
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
}

let lastType: LogType | undefined;
let lastMsg: string | undefined;
let sameCount = 0;

export const createLogger = (level: LogLevel = 'info', options: LoggerOptions = {}): Logger => {
  const loggedErrors = new WeakSet<Error | RollupError>();
  const { prefix = '[clown]', allowClearScreen = true } = options;
  const thresh = LogLevels[level];
  const canClearScreen = allowClearScreen && process.stdout.isTTY && !process.env.CI;
  const clear = canClearScreen ? clearScreen : () => {};

  function output(type: LogType, msg: string, options: LogErrorOptions = {}) {
    if (thresh >= LogLevels[type]) {
      const method = type === 'info' ? 'log' : type;
      const format = () => {
        if (options.timestamp) {
          const tag = type === 'info' ? cyan(bold(prefix)) : type === 'warn' ? yellow(bold(prefix)) : red(bold(prefix));
          return `${dim(new Date().toLocaleTimeString())} ${tag} ${msg}`;
        } else {
          return msg;
        }
      };
      if (options.error) {
        loggedErrors.add(options.error);
      }
      if (canClearScreen) {
        if (type === lastType && msg === lastMsg) {
          sameCount++;
          clear();
          console[method](format(), yellow(`(x${sameCount + 1})`));
        } else {
          sameCount = 0;
          lastMsg = msg;
          lastType = type;
          if (options.clear) {
            clear();
          }
          console[method](format());
        }
      } else {
        console[method](format());
      }
    }
  }
  const warnedMessages = new Set<string>();

  const logger: Logger = {
    hasWarned: false,
    info(msg, opts) {
      output('info', msg, opts);
    },
    warn(msg, opts) {
      logger.hasWarned = true;
      output('warn', msg, opts);
    },
    warnOnce(msg, opts) {
      if (warnedMessages.has(msg)) return;
      logger.hasWarned = true;
      output('warn', msg, opts);
      warnedMessages.add(msg);
    },
    error(msg, opts) {
      logger.hasWarned = true;
      output('error', msg, opts);
    },
    clearScreen(type) {
      if (thresh >= LogLevels[type]) {
        clear();
      }
    },
    hasErrorLogged(error) {
      return loggedErrors.has(error);
    }
  };

  return logger;
};

export function printServerUrls(url: string, info: Logger['info']): void {
  const colorUrl = (url: string) => cyan(url.replace(/:(\d+)\//, (_, port) => `:${bold(port)}/`));
  info(`  ${green('➜')}  ${bold('Local')}:   ${colorUrl(url)}`);
}
