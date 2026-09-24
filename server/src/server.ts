import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';

const startServer = async () => {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`Feedants Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`Healthcheck: http://localhost:${env.PORT}/health`);
  });

  const handleGracefulShutdown = async (signal: string) => {
    console.log(`\nReceived ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      console.log('Server and Database successfully shut down.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
};

startServer().catch((error) => {
  console.error('Fatal Server Boot Error:', error);
  process.exit(1);
});
