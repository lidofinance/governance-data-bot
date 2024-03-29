import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Statistic } from './entities';

@Injectable()
export class StatisticService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  statistic(): Statistic {
    this.logger.log('Statistic');

    return {
      timestamp: Number(new Date()),
    };
  }
}
