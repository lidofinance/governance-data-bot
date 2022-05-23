import { Module } from '@nestjs/common';
import { LoggerModule } from '../common/logger';
import { GovernanceService } from './governance.service';
import { NotionReporterModule } from './notionReporter/notion.reporter.module';
import { EasyTrackModule } from './easy-track/easy-track.module';

@Module({
  imports: [LoggerModule, NotionReporterModule, EasyTrackModule],
  controllers: [],
  providers: [GovernanceService],
})
export class GovernanceModule {}
