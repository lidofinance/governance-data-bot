import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch-retry';

@Injectable()
export class GraphqlService {
  async query(url: string, query: string) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ query }),
        retry: 3,
        pause: 1000,
      });
      if (!resp.ok)
        throw new Error(`Request failed with ${resp.status} error: ${await resp.text()}`);
      const respData = await resp.json();
      return respData.data;
    } catch (e) {
      await Promise.reject(e);
    }
  }
}
