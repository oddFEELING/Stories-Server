import pino from "pino";

const appLogger = pino({
  transport: {
    target: "pino-pretty",
  },
});

export { appLogger };
