import { EasyTrackProvider } from './easy-track.provider';
import { MotionCreatedEventArgs } from './easy-track.constants';
import { Injectable } from '@nestjs/common';
import { EasyTrackProviderService } from './easy-track.provider.service';

export interface EasyTrackEventInfo {
  creator: string;
  evmScriptCallData: string;
  executionEndDate?: number;
  created: boolean;
  enacted?: boolean;
  rejected?: boolean;
  passed?: boolean;
  cancelled?: boolean;
}

@Injectable()
export class EasyTrackEventCollector {
  constructor(
    private providerService: EasyTrackProviderService,
    private easyTrackProvider: EasyTrackProvider,
  ) {}

  async getEventInfo(motionId): Promise<EasyTrackEventInfo> {
    const events = await this.easyTrackProvider.getEvents(motionId);
    let eventInfo: EasyTrackEventInfo = {
      created: false,
      creator: '',
      evmScriptCallData: '',
    };
    for (const event of events) {
      let args;
      switch (event.name) {
        case 'MotionCreated':
          args = event.args as MotionCreatedEventArgs;
          eventInfo = {
            creator: args._creator,
            evmScriptCallData: args._evmScriptCallData,
            created: true,
          };
          break;
        case 'MotionEnacted':
          eventInfo.enacted = true;
          eventInfo.executionEndDate =
            (await this.providerService.getBlock(event.blockNumber)).timestamp *
            1000;
          break;
        case 'MotionRejected':
          eventInfo.rejected = true;
          eventInfo.passed = true;
          eventInfo.executionEndDate =
            (await this.providerService.getBlock(event.blockNumber)).timestamp *
            1000;
          break;
        case 'MotionCanceled':
          eventInfo.cancelled = true;
          eventInfo.passed = false;
          eventInfo.executionEndDate =
            (await this.providerService.getBlock(event.blockNumber)).timestamp *
            1000;
          break;
      }
    }
    return eventInfo;
  }
}
