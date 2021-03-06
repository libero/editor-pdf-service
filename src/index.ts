import express from 'express';
import logRequest from './middlewares/logRequest';
import GenerateService from './services/generate';

//TODO: replace with injectable / importable config object
const config = {
    port: process.env.PORT || 4001,
    articleStorePath: process.env.ARTICLE_STORE_PATH || 'http://localhost:8080/articles/',
    editorURL: process.env.EDITOR_URL || 'http://localhost:4000',
    generationJobStatusURL: process.env.GENERATION_STATUS_URL || 'http://localhost:80',
    generationJobStartURL: process.env.GENERATION_START_URL || 'http://localhost:80',
    generaionJobApiKey: process.env.GENERATION_API_KEY || 'mySuperSecretApiKey',
};

console.log('Starting server...');

// Initialize services
const generationService = GenerateService(config);

const app: express.Application = express();

// Log all requests on this route.
app.use(logRequest);
app.get('/health', (_, res) => res.sendStatus(200));
app.post('/generate/:articleId', async (req, res) => {
    try {
        const jobId = await generationService.startJob(req.params.articleId);
        res.status(200).send(jobId);
        return;
    } catch (error) {
        switch (error.message) {
            case 'NotFound':
                res.sendStatus(404);
                break;
            default:
                res.sendStatus(500);
                break;
        }
        return;
    }
});
app.get('/status/:jobId', async (req, res) => {
    try {
        const status = await generationService.getJobStatus(req.params.jobId);
        res.status(200).send(status);
        return;
    } catch (error) {
        res.sendStatus(500);
    }
});

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
