import type { NextFunction, Request, Response } from 'express';
import { auth } from '../config/firebase.js';
import { HttpError } from '../errors.js';

export interface AuthUser {
  uid: string;
  email?: string;
  /** Children sign in anonymously on their phone (ADR-0003). */
  isAnonymous: boolean;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

/** Verifies the Firebase ID token in `Authorization: Bearer <token>`. */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (!token) throw new HttpError(401, 'Not signed in');
  try {
    const decoded = await auth.verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      isAnonymous: decoded.firebase.sign_in_provider === 'anonymous',
    };
  } catch {
    throw new HttpError(401, 'Session expired, please sign in again');
  }
  next();
}

export function currentUser(req: Request): AuthUser {
  if (!req.user) throw new HttpError(401, 'Not signed in');
  return req.user;
}

export function requireParent(req: Request, _res: Response, next: NextFunction) {
  if (currentUser(req).isAnonymous) throw new HttpError(403, 'Only parents can do this');
  next();
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
}
