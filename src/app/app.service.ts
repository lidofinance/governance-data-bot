import {
  Inject,
  Injectable,
  LoggerService,
  OnModuleInit,
} from '@nestjs/common';
import { LOGGER_PROVIDER } from '@lido-nestjs/logger';
import * as buildInfo from 'build-info';

import { ConfigService } from 'common/config';
import { PrometheusService } from 'common/prometheus';
import { APP_NAME } from './app.constants';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject(LOGGER_PROVIDER) protected readonly logger: LoggerService,

    protected readonly configService: ConfigService,
    protected readonly prometheusService: PrometheusService,
  ) {}

  public async onModuleInit(): Promise<void> {
    const env = this.configService.get('NODE_ENV');
    const version = buildInfo.version;
    const commit = buildInfo.commit;
    const branch = buildInfo.branch;
    const name = APP_NAME;

    this.prometheusService.buildInfo
      .labels({ env, name, version, commit, branch })
      .inc();
    this.logger.log('Init app', { env, name, version });
  }
}
