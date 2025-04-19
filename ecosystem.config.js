module.exports = {
  apps: [
    {
      name: 'site-info-backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start:prod',
      env: {
        NODE_ENV: 'production',
        API_PORT: 2025,
        API_PREFIX: 'api'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    },
    {
      name: 'site-info-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run serve',
      env: {
        NODE_ENV: 'production',
        PORT: 2026,
        VUE_APP_API_URL: 'http://localhost:2025/api'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
}; 