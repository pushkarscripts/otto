import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { analyzeText, analyzeDarkPatterns, chatWithTerms } from '../services/gemini';
import { store } from '../services/store';
import { AnalyzeRequestSchema, ChatRequestSchema, DarkPatternRequestSchema } from '../schemas/analysis';

export async function analyzeRoutes(fastify: FastifyInstance) {
  
  // 1. Analyze T&C Text (with Persona & Caching)
  fastify.post('/analyze', async (request, reply) => {
    try {
      const body = AnalyzeRequestSchema.parse(request.body);
      
      // Check Cache
      if (body.url) {
        const cached = store.getAnalysis(body.url, body.persona);
        if (cached) {
          return { ...cached, from_cache: true, trust_score: store.getTrustScore(body.url) };
        }
      }

      const result = await analyzeText(body.text, body.persona);
      
      // Save to Cache if URL provided
      if (body.url) {
        store.saveAnalysis(body.url, body.persona, result);
        // Inject trust score
        (result as any).trust_score = store.getTrustScore(body.url);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: 'Validation Error', details: error.errors });
      } else {
        fastify.log.error(error);
        reply.status(500).send({ error: 'Internal Server Error' });
      }
    }
  });

  // 2. Chat with Document
  fastify.post('/chat', async (request, reply) => {
    try {
      const body = ChatRequestSchema.parse(request.body);
      const result = await chatWithTerms(body.message, body.text, body.history || []);
      return result;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Chat Failed' });
    }
  });

  // 3. Detect Dark Patterns (Vision)
  fastify.post('/detect-dark-patterns', async (request, reply) => {
    try {
      const body = DarkPatternRequestSchema.parse(request.body);
      const result = await analyzeDarkPatterns(body.imageBase64);
      return result;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Vision Analysis Failed' });
    }
  });
}
