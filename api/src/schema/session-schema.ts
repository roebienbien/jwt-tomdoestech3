import mongoose from 'mongoose';
import { z } from 'zod';
import { signJwt } from '../utils/jwt-utils';
import { omit } from 'lodash';

interface SessionDocument extends mongoose.Document {
  sessionId: string;
  email: string;
  name: string;
  valid?: boolean;
  refreshToken: string;
  // iat?: number;
  // exp?: number;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
  sessionId: String,
  email: String,
  name: String,
  valid: Boolean,
  refreshToken: String,
  // iat: Number,
  // exp: Number,
});

export const createSessionSchema = z.object({
  body: z.object({
    sessionId: z.string({ required_error: 'required field' }),
    email: z.string({ required_error: 'required field' }),
    name: z.string({ required_error: 'required field' }),
    valid: z.boolean({ required_error: 'required field' }),
  }),
});

export default sessionSchema;
export const SessionModel = mongoose.model('Session', sessionSchema);
export type CreateSessionInput = z.TypeOf<typeof createSessionSchema>['body'];

// const sessions: Record<string, { sessionId: string; email: string; valid: boolean }> = {};

export async function getSessionDb(sessionId: string) {
  const session = await SessionModel.findOne({ sessionId });

  return session && session.valid ? omit(session?.toObject(), 'refreshToken') : null;
  // return session && session.valid ? session : null;
}

export async function createSessionDb(email: string, name: string) {
  // const sessionId = String(Object.keys(sessions).length + 1);
  const count = await SessionModel.countDocuments({});
  const sessionId = count + 1;

  const refreshToken = signJwt({ sessionId }, '1y');

  const session = SessionModel.create({ sessionId, email, valid: true, name, refreshToken });

  return omit((await session).toObject(), 'refreshToken');
}
