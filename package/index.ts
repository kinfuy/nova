import minimist from "minimist";
import pkg from "../package/package.json";
import { createServer } from "./server";
const init = async () => {
  const argv = minimist(process.argv.slice(2), {
    string: ["_"],
    alias: {
      version: ["v", "version"],
    },
  });
  if (argv.version) console.log(`v${pkg.version}`);

  const server = await createServer();

  if (!server.httpServer) throw new Error("HTTP server not available");

  await server.listen();
};

init().catch((e) => {
  console.error(e);
});
