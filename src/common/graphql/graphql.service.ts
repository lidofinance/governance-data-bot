import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class GraphqlService {
  async query(url: string, query: string) {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    if (!resp.ok)
      throw new Error(
        `Request ${resp.url} failed with ${
          resp.status
        } error: ${await resp.text()}`,
      );
    const respData = await resp.json();
    return respData.data;
  }
}
