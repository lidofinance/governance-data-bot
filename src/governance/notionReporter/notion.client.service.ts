import { Injectable } from '@nestjs/common';
import { PrometheusService } from '../../common/prometheus';
import { Client } from '@notionhq/client';
import { ConfigService } from '../../common/config';
import { RequestParameters } from '@notionhq/client/build/src/Client';

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
}
