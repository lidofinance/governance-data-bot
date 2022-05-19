import { Module } from '@nestjs/common';
import { LoggerModule } from '../../common/logger';
import { NotionReporterService } from './notion.reporter.service';
import { ConfigService } from '../../common/config';
import { NotionClientService } from './notion.client.service';

@Module({
  imports: [LoggerModule],
  controllers: [],
  exports: [NotionReporterService],
  providers: [NotionReporterService, ConfigService, NotionClientService],
})
export class NotionReporterModule {}
