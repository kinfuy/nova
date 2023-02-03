import type { RequestListener } from "node:http";
import { green, white } from "kolorist";
import { createLogger, printServerUrls } from "../logger";
import {
  createServerCloseFn,
  httpServerStart,
  openBrowser,
  resolveHttpServer,
} from "./http";

export const createServer = async () => {
  const httpServerOptions: RequestListener = (req, res) => {
    res.setHeader("content-type", "text/html;charset=utf8");
    res.end(`cgit hello`);
  };

  const logger = createLogger();

  const httpServer = await resolveHttpServer(httpServerOptions);

  const closeHttpServer = createServerCloseFn(httpServer);

  const printStart = () => {
    logger.clearScreen();
    logger.info(`\n${green(`CGIT SERVER V1.0.0`)}`);
    printServerUrls(
      `\n   ${white("> Local: ")} http://localhost:8080`,
      logger.info
    );
  };

  const server = {
    httpServer,
    listen: async () => {
      await httpServerStart(httpServer, {
        port: 8080,
        strictPort: false,
        host: "localhost",
        logger,
      });
      openBrowser("http://localhost:8080");
      printStart();
      return server;
    },
    close: async () => {
      closeHttpServer();
    },
  };

  return server;
};
