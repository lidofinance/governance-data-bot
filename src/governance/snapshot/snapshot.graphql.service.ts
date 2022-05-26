import { PrometheusService } from '../../common/prometheus';
import { Injectable } from '@nestjs/common';
import { GraphqlService } from '../../common/graphql/graphql.service';
import { SNAPSHOT_SPACE_ID } from './snapshot.constants';
import { ConfigService } from '../../common/config';

export interface GraphqlProposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: string;
  author: string;
  link: string;
  scores: number[];
  type: string;
  discussion: string;
}

@Injectable()
export class SnapshotGraphqlService extends GraphqlService {
  constructor(
    private prometheusService: PrometheusService,
    private configService: ConfigService,
  ) {
    super();
  }

  async getActiveProposals() {
    return this.getProposals('state: "active"');
  }

  async getPastProposalsByDate(date: number) {
    return this.getProposals(`start_gt: ${date}`);
  }

  async getPastProposalsByIds(ids: string[]) {
    if (ids.length === 0) return [];
    return this.getProposals(`id_in: ${JSON.stringify(ids)}`);
  }

  async getProposals(whereCondition: string): Promise<GraphqlProposal[]> {
    const query = `query Proposals {
      proposals(
        first: 20,
        skip: 0,
        where: {
          space: "${SNAPSHOT_SPACE_ID}"
          ${whereCondition}
        },
        orderBy: "created",
        orderDirection: desc
      ) {
        id
        title
        body
        choices
        start
        end
        snapshot
        state
        author
        link
        scores
        type
        discussion
      }
    }`;
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: SnapshotGraphqlService.name,
    });
    return (
      await this.query(
        this.configService.get('SNAPSHOT_PROPOSALS_GRAPHQL_URL'),
        query,
      )
    ).proposals;
  }
}
