import { Request, Response } from 'express';
import { createSession, getUser, invalidateSession } from '../db/db';
import { signJwt, verifyJwt } from '../utils/jwt-utils';
import { createSessionDb } from '../schema/session-schema';

export async function createSessionHandler(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = getUser(email);

  if (!user || user.password !== password) return res.status(401).send('invalid email or password');

  // const session = createSession(email, user.name);
  const session = await createSessionDb(email, user.name);

  const accessToken = signJwt({ email: user.email, name: user.name, sessionId: session.sessionId }, '5s');
  const refreshToken = signJwt({ sessionId: session.sessionId }, '1y');

  res.cookie('accessToken', accessToken, {
    maxAge: 300000, //5 mins
    httpOnly: true,
  });

  res.cookie('refreshToken', refreshToken, {
    maxAge: 3.154e10, // 1 year
    httpOnly: true,
  });

  // return res.send(verifyJwt(accessToken).payload);
  return res.send(session);
}

export function getSessionHandler(req: Request, res: Response) {
  // @ts-ignore
  const user = req.user;
  if (!user) return res.send('Error: user undefined');
  return res.send(user);
}

export function deleteSessionHandler(req: Request, res: Response) {
  res.cookie('accessToken', '', {
    maxAge: 0,
    httpOnly: true,
  });

  res.cookie('refreshToken', '', {
    maxAge: 0,
    httpOnly: true,
  });

  // @ts-ignore
  const session = invalidateSession(req.user.sessionId);

  res.send(session);
}
