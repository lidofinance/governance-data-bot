import { PrometheusService } from '../../common/prometheus';
import { GraphqlService } from '../../common/graphql/graphql.service';
import { GRAPHQL_MOTIONS_URL } from './easy-track.constants';
import { Injectable } from '@nestjs/common';

export interface GraphqlMotion {
  id: string;
  evmScriptFactory: string;
  creator: string;
  duration: string;
  startDate: string;
  snapshotBlock: string;
  objectionsThreshold: string;
  objectionsAmount: string;
  evmScriptHash: string;
  evmScriptCalldata: string;
  status: string;
  enacted_at: string | null;
  canceled_at: string | null;
  rejected_at: string | null;
}

@Injectable()
export class EasyTrackGraphqlService extends GraphqlService {
  constructor(private prometheusService: PrometheusService) {
    super();
  }

  async getMotions(whereCondition: string): Promise<GraphqlMotion[]> {
    const query = `{motions(
      orderBy: startDate 
      orderDirection: desc 
      where: { status_in: ["CANCELED", "REJECTED", "ENACTED"]
               ${whereCondition} }) 
      {
        id
        evmScriptFactory
        creator
        duration
        startDate
        snapshotBlock
        objectionsThreshold
        objectionsAmount
        evmScriptHash
        evmScriptCalldata
        status
        enacted_at
        canceled_at
        rejected_at
      }
    }`;
    return (await this.query(query)).motions;
  }

  async query(query: string) {
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: EasyTrackGraphqlService.name,
    });
    return await super.query(GRAPHQL_MOTIONS_URL, query);
  }
}
