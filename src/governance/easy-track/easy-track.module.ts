import { Module } from '@nestjs/common';
import { EasyTrackService } from './easy-track.service';
import { EasyTrackProviderService } from './easy-track.provider.service';
import { EasyTrackDescriptionCollector } from './easy-track-description-collector.service';
import { EasyTrackProvider } from './easy-track.provider';
import { EasyTrackEventCollector } from './easy-track-event-collector.service';

@Module({
  imports: [],
  controllers: [],
  exports: [EasyTrackService],
  providers: [
    EasyTrackService,
    EasyTrackProviderService,
    EasyTrackDescriptionCollector,
    EasyTrackEventCollector,
    EasyTrackProvider,
  ],
})
export class EasyTrackModule {}
