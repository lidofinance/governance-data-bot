import { Module } from '@nestjs/common';
import { NotionReporterService } from './notion.reporter.service';
import { NotionClientService } from './notion.client.service';

@Module({
  imports: [],
  controllers: [],
  exports: [NotionReporterService],
  providers: [NotionReporterService, NotionClientService],
})
export class NotionReporterModule {}
