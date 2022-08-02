import { Module } from '@nestjs/common';
import { AragonService } from './aragon.service';
import { AragonProviderService } from './aragon.provider.service';
import { AragonProvider } from './aragon.provider';
import { AragonConfig } from './aragon.config';

@Module({
  imports: [],
  controllers: [],
  exports: [AragonService],
  providers: [
    AragonService,
    AragonProviderService,
    AragonProvider,
    AragonConfig,
  ],
})
export class AragonModule {}
