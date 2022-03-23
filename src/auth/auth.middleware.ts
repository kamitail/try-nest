import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { ValidUser } from './auth.types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorizationToken = req.headers.authorization;
    const validUser: ValidUser = await this.authService
      .validateUser(authorizationToken)
      .catch(() => null);
    res.locals.userId = validUser?.userId;

    next();
  }
}
