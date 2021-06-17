import express from 'express';
import logRequest from './middlewares/logRequest';
import GenerateService from './services/generate';

//TODO: replace with injectable / importable config object
const config = {
  port: process.env.PORT || 4000,
  articleStorePath: process.env.ARTICLE_STORE_PATH || 'http://localhost:8080/articles/',
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
    await generationService.startJob(req.params.articleId);
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

  res.sendStatus(200);
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
