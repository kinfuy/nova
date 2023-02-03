import { cac } from 'cac';
import pkg from '../package.json';
import { createServer } from '../server';
const cli = cac('clown-git');

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
    const server = await createServer();
    if (!server) return;
    await server.listen();
  });

cli.help();
cli.version(`v${pkg.version}`);

cli.parse();
