import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { includes } from 'ramda';
import { HANDLERS_WITHOUT_AUTH } from './auth.constants';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  private async validateRequest(
    request: Request,
    handlerName: string,
  ): Promise<boolean> {
    const authorizationToken = request.headers.authorization;
    return (
      includes(handlerName, HANDLERS_WITHOUT_AUTH) ||
      (authorizationToken &&
        !!(await this.authService
          .validateUser(authorizationToken)
          .catch(() => false)))
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const handlerName: string = context.getHandler().name;
    return await this.validateRequest(request, handlerName);
  }
}
