import { Injectable } from '@nestjs/common';
import { FetchService } from '@lido-nestjs/fetch';

const RETRIES_COUNT = 5;
const RETRY_PAUSE = 1000;

@Injectable()
export class GraphqlService {
  constructor(protected fetchService: FetchService) {}
  async query<T>(query: string) {
    try {
      const resp: { data: T } = await this.fetchService.fetchJson('', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ query }),
        retryPolicy: {
          attempts: RETRIES_COUNT,
          delay: RETRY_PAUSE,
        },
      });
      return resp.data;
    } catch (e) {
      await Promise.reject(e);
    }
  }
}
