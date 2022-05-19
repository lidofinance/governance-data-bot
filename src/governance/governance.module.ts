import { Module } from '@nestjs/common';
import { LoggerModule } from '../common/logger';
import { GovernanceService } from './governance.service';
import { NotionReporterModule } from './notionReporter/notion.reporter.module';
import { EasytrackModule } from './easytrack/easytrack.module';

@Module({
  imports: [LoggerModule, NotionReporterModule, EasytrackModule],
  controllers: [],
  providers: [GovernanceService],
})
export class GovernanceModule {}
