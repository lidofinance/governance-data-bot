import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/config';
import { PrometheusService } from '../../common/prometheus';
import { ethers } from 'ethers';

@Injectable()
export class AragonProviderService extends ethers.providers
  .StaticJsonRpcProvider {
  constructor(
    private configService: ConfigService,
    private prometheusService: PrometheusService,
  ) {
    super(configService.get('ETH_RPC_URL'));
  }

  send(method: string, params: Array<any>): Promise<any> {
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: AragonProviderService.name,
    });
    return super.send(method, params);
  }
}
