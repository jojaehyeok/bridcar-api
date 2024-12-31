module.exports = {
  apps: [
    {
      name: "nest-app",
      script: "./dist/main.js",
      instances: "max",
      exec_mode: "cluster",
      watch: false,
    },
  ],
};

