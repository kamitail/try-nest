import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Response } from 'express';

export const Locals = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const response: Response = ctx.switchToHttp().getResponse();
    const locals = response.locals;

    return data ? locals?.[data] : locals;
  },
);
