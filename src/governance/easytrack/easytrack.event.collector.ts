import { JsonRpcProvider } from '@ethersproject/providers/src.ts/json-rpc-provider';
import { EasytrackProvider } from './easytrack.provider';
import { MotionCreatedEventArgs } from './easytrack.constants';

export interface EasytrackEventInfo {
  creator: string;
  evmScriptCallData: string;
  executionEndDate?: number;
  created: boolean;
  enacted?: boolean;
  rejected?: boolean;
  passed?: boolean;
  cancelled?: boolean;
}

export class EasytrackEventCollector {
  private easytrackProvider: EasytrackProvider;

  constructor(private provider: JsonRpcProvider) {
    this.easytrackProvider = new EasytrackProvider(this.provider);
  }

  async getEventInfo(motionId): Promise<EasytrackEventInfo> {
    const events = await this.easytrackProvider.getEvents(motionId);
    let eventInfo: EasytrackEventInfo;
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
            (await this.provider.getBlock(event.blockNumber)).timestamp * 1000;
          break;
        case 'MotionRejected':
          eventInfo.rejected = true;
          eventInfo.passed = true;
          eventInfo.executionEndDate =
            (await this.provider.getBlock(event.blockNumber)).timestamp * 1000;
          break;
        case 'MotionCanceled':
          eventInfo.cancelled = true;
          eventInfo.passed = false;
          eventInfo.executionEndDate =
            (await this.provider.getBlock(event.blockNumber)).timestamp * 1000;
          break;
      }
    }
    return eventInfo;
  }
}
