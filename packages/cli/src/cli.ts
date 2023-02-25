#!/usr/bin/env node

import { cac } from 'cac';
import { createServer } from '@clown/core';
import pkg from '../package.json';
import { join } from 'path';
const cli = cac('clown');

export const defaultServerConfig = {
  rootdir:__dirname,
  port: 5124,
  host: 'localhost'
};

cli
  .option('-c, --config <file>', `[string] use specified config file`)
  .option('--s <path>', `[string] public base path (default: /)`)
  .option('-l, --logLevel <level>', `[string] info | warn | error | silent`)
  .option('--clearScreen', `[boolean] allow/disable clear screen when logging`);

cli
  .command('[root]', 'start dev server')
  .alias('serve')
  .alias('dev')
  .option('--host [host]', `[string] specify hostname`)
  .option('--port <port>', `[number] specify port`)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .action(async (root: string, options: any) => {
    const rootdir = join(__dirname)
    const server = await createServer(defaultServerConfig);
    if (!server) return;
    await server.listen();
  });

cli.help();
cli.version(`v${pkg.version}`);

cli.parse();
