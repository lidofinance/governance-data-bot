import { Injectable } from '@nestjs/common';
import { PrometheusService } from '../../common/prometheus';
import { Client } from '@notionhq/client';
import { ConfigService } from '../../common/config';
import { RequestParameters } from '@notionhq/client/build/src/Client';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';

@Injectable()
export class NotionClientService extends Client {
  constructor(
    private prometheusService: PrometheusService,
    private configService: ConfigService,
  ) {
    super({ auth: configService.get('NOTION_INTEGRATION_TOKEN') });
  }

  request<ResponseBody>({
    path,
    method,
    query,
    body,
    auth,
  }: RequestParameters): Promise<ResponseBody> {
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: NotionClientService.name,
    });
    return super.request({ path, method, query, body, auth });
  }

  async *queryDatabase(databaseId: string) {
    let has_more = true;
    let start_cursor;
    while (has_more) {
      const response: QueryDatabaseResponse = await this.databases.query({
        database_id: databaseId,
        page_size: 10,
        ...(start_cursor && { start_cursor: start_cursor }),
      });
      yield* response.results;
      has_more = response.has_more;
      start_cursor = response.next_cursor;
    }
  }
}
