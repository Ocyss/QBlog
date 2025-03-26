module.exports = {
  apps: [
    {
      name: 'QBlog',
      port: '3000',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs',
      node_args: '--env-file .env',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      time: true,
    },
  ],
}
