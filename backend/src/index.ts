import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import { analyzeRoutes } from './routes/analyze';

dotenv.config();

const fastify = Fastify({
  logger: true,
  bodyLimit: 10485760, // 10MB limit for images
});

fastify.register(cors, {
  origin: true, // Allow all for extension development
});

fastify.register(analyzeRoutes);

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
