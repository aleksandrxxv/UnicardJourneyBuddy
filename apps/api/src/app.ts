import cors from 'cors';
import express from 'express';
import { createChildController } from './controllers/childController.js';
import { createJourneyController } from './controllers/journeyController.js';
import { MockTransportProvider } from './integrations/transport/MockTransportProvider.js';
import { childrenRouter } from './routes/children.js';
import { healthRouter } from './routes/health.js';
import { journeysRouter } from './routes/journeys.js';
import { DestinationService } from './services/DestinationService.js';
import { JourneyService } from './services/JourneyService.js';

export function createApp() {
  const destinations = new DestinationService();
  // Swap for a real provider once the transport data spike (ADR-0002) is decided.
  const journeys = new JourneyService(new MockTransportProvider(), destinations);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/health', healthRouter);
  app.use('/children', childrenRouter(createChildController(destinations)));
  app.use('/journeys', journeysRouter(createJourneyController(journeys)));

  return app;
}
