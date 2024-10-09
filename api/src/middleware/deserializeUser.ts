import { NextFunction, Request, Response } from 'express';
import { signJwt, verifyJwt } from '../utils/jwt-utils';
import { getSession } from '../db/db';
import { getSessionDb } from '../schema/session-schema';

export default async function deserializeUser(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken } = req.cookies;

  if (!accessToken) return next();

  const { payload, expired } = verifyJwt(accessToken);

  console.log('payload:', payload, 'expired:', expired);

  if (payload) {
    // @ts-ignore
    req.user = payload;
    return next();
  }

  const { payload: refresh } = expired && refreshToken ? verifyJwt(refreshToken) : { payload: null };

  if (!refresh) return next();

  // @ts-ignore
  // const session = getSession(refresh.sessionId);

  // HERE payload must be plain object
  const session = await getSessionDb(refresh.sessionId);
  // const plainSession = session?.toObject();

  if (!session) return next();

  const newAccessToken = signJwt(session, '5s');

  res.cookie('accessToken', newAccessToken, {
    maxAge: 300000, //5 mins
    httpOnly: true,
  });

  // @ts-ignore
  req.user = verifyJwt(newAccessToken).payload;

  return next();
}
