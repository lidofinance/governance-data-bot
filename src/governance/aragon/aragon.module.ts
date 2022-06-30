import { Module } from '@nestjs/common';
import { AragonService } from './aragon.service';
import { AragonProviderService } from './aragon.provider.service';
import { AragonProvider } from './aragon.provider';

@Module({
  imports: [],
  controllers: [],
  exports: [AragonService],
  providers: [AragonService, AragonProviderService, AragonProvider],
})
export class AragonModule {}
