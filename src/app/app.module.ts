import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { PrometheusModule } from 'common/prometheus';
import { ConfigModule } from 'common/config';
import { SentryInterceptor } from 'common/sentry';
import { HealthModule } from 'common/health';
import { AppService } from './app.service';
import { HTTPModule } from '../http';
import { EasytrackModule } from '../governance/easytrack/easytrack.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GovernanceModule } from '../governance/governance.module';

@Module({
  imports: [
    HTTPModule,
    HealthModule,
    PrometheusModule,
    ConfigModule,
    EasytrackModule,
    GovernanceModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: SentryInterceptor },
    AppService,
  ],
})
export class AppModule {}
