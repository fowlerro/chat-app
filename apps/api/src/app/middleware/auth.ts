import { Request, Response, NextFunction } from 'express';

function auth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.user?.login) return res.sendStatus(401);

  next();
}

export default auth;
