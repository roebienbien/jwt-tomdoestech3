import jwt from 'jsonwebtoken';
import config from '../config/config';
import sessionSchema, { CreateSessionInput } from '../schema/session-schema';

export function signJwt(payload: any, expiresIn: string | number) {
  return jwt.sign(payload, config.secret.privateKey, { algorithm: 'RS256', expiresIn });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, config.secret.publicKey);
    return { payload: decoded, expired: false };
  } catch (error: any) {
    return { payload: null, expired: error.message.includes('jwt expired') };
  }
}
