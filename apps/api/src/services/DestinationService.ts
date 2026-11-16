import type { SavedDestination } from '@journeybuddy/shared';
import { approvedDestinationsByChild } from '../data/mockData.js';

export class DestinationService {
  listApproved(childId: string): SavedDestination[] | undefined {
    return approvedDestinationsByChild[childId];
  }

  findApproved(childId: string, destinationId: string): SavedDestination | undefined {
    return this.listApproved(childId)?.find((d) => d.id === destinationId);
  }
}
