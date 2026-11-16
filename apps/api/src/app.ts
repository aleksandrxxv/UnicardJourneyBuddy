import cors from 'cors';
import express from 'express';
import { db } from './config/firebase.js';
import { createChildController } from './controllers/childController.js';
import { createJourneyController } from './controllers/journeyController.js';
import { MockTransportProvider } from './integrations/transport/MockTransportProvider.js';
import { errorHandler, requireAuth } from './middleware/auth.js';
import { FirestoreChildRepository } from './repositories/FirestoreChildRepository.js';
import { childrenRouter } from './routes/children.js';
import { healthRouter } from './routes/health.js';
import { journeysRouter } from './routes/journeys.js';
import { meRouter } from './routes/me.js';
import { pairingRouter } from './routes/pairing.js';
import { ChildService } from './services/ChildService.js';
import { JourneyService } from './services/JourneyService.js';

export function createApp() {
  const children = new ChildService(new FirestoreChildRepository(db));
  // Swap for a real provider once the transport data spike (ADR-0002) is decided.
  const journeys = new JourneyService(new MockTransportProvider(), children);
  const childController = createChildController(children);

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/health', healthRouter);

  // Everything below needs a valid Firebase ID token (ADR-0003).
  app.use(requireAuth);
  app.use('/me', meRouter(childController));
  app.use('/children', childrenRouter(childController));
  app.use('/pairing', pairingRouter(childController));
  app.use('/journeys', journeysRouter(createJourneyController(journeys)));

  app.use(errorHandler);
  return app;
}
