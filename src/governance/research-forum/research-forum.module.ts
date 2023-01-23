import { Module } from '@nestjs/common';
import { ResearchForumService } from './research-forum.service';
import { ResearchForumProvider } from './research-forum.provider';
import { ResearchForumConfig } from './research-forum.config';
import { FetchModule } from '@lido-nestjs/fetch';
import { ConfigModule, ConfigService } from '../../common/config';

@Module({
  imports: [
    ConfigModule,
    FetchModule.forFeatureAsync({
      async useFactory(configService: ConfigService) {
        return {
          baseUrls: [configService.get('RESEARCH_FORUM_DISCOURSE_URL')],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  exports: [ResearchForumService],
  providers: [ResearchForumConfig, ResearchForumService, ResearchForumProvider],
})
export class ResearchForumModule {}
