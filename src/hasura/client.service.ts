import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'graphqurl';
import { includes } from 'ramda';

@Injectable()
export class ClientService {
  constructor(private configService: ConfigService) {}

  private client = createClient({
    endpoint: this.configService.get('HASURA_ENDPOINT'),
  });

  async clientQuery(
    query: string,
    variables: Record<string, any>,
  ): Promise<any> {
    return this.client.query({ query, variables }).catch((error: any) => {
      const errorMessage = error?.errors.length && error?.errors[0]?.message;
      throw new HttpException(
        includes('Not-NULL violation', errorMessage)
          ? 'יש שדות שעדיין לא מולאו'
          : includes('Uniqueness violation', errorMessage)
          ? 'האימייל או מספר הטלפון כבר בשימוש'
          : error.message,
        errorMessage
          ? HttpStatus.BAD_REQUEST
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }
}
