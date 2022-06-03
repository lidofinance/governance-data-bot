import { Module } from '@nestjs/common';
import { LoggerModule } from '../../common/logger';
import { ConfigService } from '../../common/config';
import { ResearchForumService } from './research-forum.service';
import { ResearchForumProvider } from './research-forum.provider';

@Module({
  imports: [LoggerModule],
  controllers: [],
  exports: [ResearchForumService],
  providers: [ConfigService, ResearchForumService, ResearchForumProvider],
})
export class ResearchForumModule {}
