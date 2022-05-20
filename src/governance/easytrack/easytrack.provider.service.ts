import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../common/config';
import { PrometheusService } from '../../common/prometheus';
import { ethers } from 'ethers';

@Injectable()
export class EasytrackProviderService extends ethers.providers.JsonRpcProvider {
  constructor(
    private configService: ConfigService,
    private prometheusService: PrometheusService,
  ) {
    super(configService.get('ETH_RPC_URL'));
  }

  send(method: string, params: Array<any>): Promise<any> {
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: EasytrackProviderService.name,
    });
    return super.send(method, params);
  }
}
