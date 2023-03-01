#!/usr/bin/env node

import { cac } from 'cac';
import { createServer } from '@clown/core';
import pkg from '../package.json';
const cli = cac('clown');

export const defaultServerConfig = {
  rootdir: __dirname,
  port: 5124,
  host: 'localhost'
};

cli
  .option('-c, --config <file>', `[string] use specified config file`)
  .option('--s <path>', `[string] public base path (default: /)`)
  .option('-l, --logLevel <level>', `[string] info | warn | error | silent`)
  .option('--clearScreen', `[boolean] allow/disable clear screen when logging`);

cli
  .command('config', 'start config server')
  .option('--port <port>', `[number] specify port`)
  .action(async (options: any) => {
    console.log(options);
    const server = await createServer(Object.assign(defaultServerConfig, options));
    if (!server) return;
    await server.listen();
  });

cli
  .command('[flow]', 'start dev server')
  .alias('f')
  .action(async (flow: string, options: any) => {
    console.log(flow);
    console.log(options);
  });

cli.help();
cli.version(`v${pkg.version}`);

cli.parse();
