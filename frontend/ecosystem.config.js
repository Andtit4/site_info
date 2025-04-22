module.exports = {
    apps: [{
        name: 'site-info-frontend',
        script: 'npm',
        args: 'run serve',
        env: {
            PORT: 5000,
            NODE_ENV: 'development'
        },
        exec_mode: 'fork',
        instances: 1,
        autorestart: true,
        watch: true,
        max_memory_restart: '512M'
    }]
};