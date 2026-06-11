module.exports = {
    apps: [
        {
            name: 'wahana-crm-panel',
            script: './node_modules/vite/bin/vite.js',
            args: 'preview --host',
            max_restarts: 10,
            autorestart: true
        },

    ],
}