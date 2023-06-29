import { Module } from '@nestjs/common';
import { EasyTrackService } from './easy-track.service';
import { EasyTrackDescriptionCollector } from './easy-track-description-collector.service';
import { EasyTrackProvider } from './easy-track.provider';
import { EasyTrackEventCollector } from './easy-track-event-collector.service';
import { EasyTrackGraphqlService } from './easy-track.graphql.service';
import { EasyTrackConfig } from './easy-track.config';
import { FetchModule } from '@lido-nestjs/fetch';
import { ConfigService } from '../../common/config';

@Module({
  imports: [
    FetchModule.forFeatureAsync({
      async useFactory(configService: ConfigService) {
        return {
          baseUrls: [configService.get('EASYTRACK_MOTIONS_GRAPHQL_URL')],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  exports: [EasyTrackService],
  providers: [
    EasyTrackService,
    EasyTrackConfig,
    EasyTrackDescriptionCollector,
    EasyTrackEventCollector,
    EasyTrackProvider,
    EasyTrackGraphqlService,
  ],
})
export class EasyTrackModule {}
