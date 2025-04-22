module.exports = {
    apps: [{
            name: 'site-info-frontend',
            cwd: './frontend',
            script: 'npm',
            args: 'run serve',
            env: {
                NODE_ENV: 'production',
                PORT: 2026,
                VUE_APP_API_URL: 'https://site-info-xi.vercel.app/api'
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            log_date_format: 'YYYY-MM-DD HH:mm:ss'
        }

    ]
};