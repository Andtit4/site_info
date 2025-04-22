module.exports = {
    apps: [{
        name: 'site-info-frontend',
        script: 'serve',
        env: {
            PM2_SERVE_PATH: './dist',
            PM2_SERVE_PORT: 5000,
            PM2_SERVE_SPA: 'true',
            PM2_SERVE_HOMEPAGE: '/index.html'
        },
        exec_mode: 'cluster',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '512M'
    }]
};