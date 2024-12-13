module.exports = {
  apps: [
    {
      name: "Stories Server",
      script: "./src/index.ts",
      interpreter: "bun",
      args: "watch attach",
      env_production: {
        NODE_ENV: "production",
        PORT: 8080,
      },
      env_development: {
        NODE_ENV: "development",
        port: 8080,
        ignore_watch: [
          "./node_modules",
          "./package.json",
          "./bun.lockb",
          "/logs",
        ],
      },

      // ~ ======= logging -->
      out_file: "./logs/out.log",
      error_file: "./logs/error.log",
      merge_logs: true,
    },
  ],
};
