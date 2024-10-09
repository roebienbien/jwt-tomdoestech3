import { Request, Response, NextFunction } from 'express';
export function requireUser(req: Request, res: Response, next: NextFunction) {
  // @ts-ignore
  const user = req.user;
  if (!user) return res.status(403).send('forbidden invalid session');
  return next();
}
