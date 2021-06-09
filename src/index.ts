import express from 'express';

//TODO: replace with injectable / importable config object
const config = {
    port: process.env.PORT || 4000,
};

console.log('Starting server...');

const app: express.Application = express();
app.get('/health', (_, res) => res.sendStatus(200));

const server = app.listen(config.port, () => {
    // Make sure the application cleanly shuts down on SIGINT
    process.on('SIGINT', terminate);
    process.on('SIGTERM', terminate);

    console.log(`Server listening on port ${config.port}`);
});

// Cleanly shuts down the application
function terminate(): void {
    console.log(`Shutting down...`);
    if (server) {
        server.close(() => {
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
}

module.exports = server;
