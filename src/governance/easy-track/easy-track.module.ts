import { Module } from '@nestjs/common';
import { EasyTrackService } from './easy-track.service';
import { EasyTrackDescriptionCollector } from './easy-track-description-collector.service';
import { EasyTrackProvider } from './easy-track.provider';
import { EasyTrackEventCollector } from './easy-track-event-collector.service';
import { EasyTrackGraphqlService } from './easy-track.graphql.service';
import { EasyTrackConfig } from './easy-track.config';

@Module({
  imports: [],
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
