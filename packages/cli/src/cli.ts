#!/usr/bin/env node

import { cac } from 'cac';
import { createServer, installFlow, runFlow } from 'nova-sh-core';
import pkg from '../package.json';
const cli = cac('nova');

export const defaultServerConfig = {
  rootdir: __dirname,
  port: 5124,
  host: 'localhost'
};

cli
  .option('-l, --logLevel <level>', `[string] info | warn | error | silent`)
  .option('--clearScreen', `[boolean] allow/disable clear screen when logging`);

cli
  .command('config', 'start config server')
  .option('--port <port>', `[number] specify port`)
  .action(async (options: any) => {
    const server = await createServer(Object.assign(defaultServerConfig, options));
    if (!server) return;
    await server.listen();
  });

cli
  .command('install ', 'install flow')
  .option('--flow <flow>', `[number] specify port`)
  .alias('i')
  .action(async (options: any) => {
    await installFlow(options.flow);
  });

cli.command('run [flow]', 'run flow with alias').action(async (flow: string) => {
  await runFlow(flow);
});

cli.command('[custom]', 'run flow').action(async (custom: string) => {
  if (custom === 'flow') {
    await runFlow(custom);
  }
});

cli.help();
cli.version(`v${pkg.version}`);

cli.parse();
