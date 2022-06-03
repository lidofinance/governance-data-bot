import { Module } from '@nestjs/common';
import { LoggerModule } from '../common/logger';
import { GovernanceService } from './governance.service';
import { NotionReporterModule } from './notionReporter/notion.reporter.module';
import { EasyTrackModule } from './easy-track/easy-track.module';
import { SnapshotModule } from './snapshot/snapshot.module';
import { AragonModule } from './aragon/aragon.module';
import { ResearchForumModule } from './research-forum/research-forum.module';

@Module({
  imports: [
    LoggerModule,
    NotionReporterModule,
    EasyTrackModule,
    SnapshotModule,
    AragonModule,
    ResearchForumModule,
  ],
  controllers: [],
  providers: [GovernanceService],
})
export class GovernanceModule {}
