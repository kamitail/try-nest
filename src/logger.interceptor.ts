import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { join, keys, pipe, toUpper } from 'ramda';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestRoute = context.switchToHttp().getRequest().route;
    const response: Response = context.switchToHttp().getResponse();
    const logger = new Logger();

    const now = Date.now();
    return next.handle().pipe(
      catchError(async (error: HttpException) => {
        const errRes: any = error.getResponse();
        logger.error(
          `{path: ${requestRoute.path}, method: ${pipe(
            keys,
            join(', '),
            toUpper,
          )(requestRoute.methods)}, status: ${error.getStatus()}, error: ${
            errRes?.message[0] || error.message
          }, duration: ${Date.now() - now}ms}`,
        );
        throw error;
      }),
      tap(() =>
        logger.log(
          `{path: ${requestRoute.path}, method: ${pipe(
            keys,
            join(', '),
            toUpper,
          )(requestRoute.methods)}, status: ${response.status}, duration: ${
            Date.now() - now
          }ms}`,
        ),
      ),
    );
  }
}
