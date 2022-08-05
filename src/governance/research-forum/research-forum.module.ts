import { Module } from '@nestjs/common';
import { ResearchForumService } from './research-forum.service';
import { ResearchForumProvider } from './research-forum.provider';
import { ResearchForumConfig } from './research-forum.config';

@Module({
  imports: [],
  controllers: [],
  exports: [ResearchForumService],
  providers: [ResearchForumConfig, ResearchForumService, ResearchForumProvider],
})
export class ResearchForumModule {}
