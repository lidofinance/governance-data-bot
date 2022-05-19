import { Module } from '@nestjs/common';
import { EasytrackService } from './easytrack.service';
import { EasytrackProviderService } from './easytrack.provider.service';
import { EasytrackDescriptionCollector } from './easytrack.description.collector';
import { EasytrackProvider } from './easytrack.provider';
import { EasytrackEventCollector } from './easytrack.event.collector';

@Module({
  imports: [],
  controllers: [],
  exports: [EasytrackService],
  providers: [
    EasytrackService,
    EasytrackProviderService,
    EasytrackDescriptionCollector,
    EasytrackEventCollector,
    EasytrackProvider,
  ],
})
export class EasytrackModule {}
