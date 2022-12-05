import { Module } from '@nestjs/common';
import { AragonService } from './aragon.service';
import { AragonProvider } from './aragon.provider';
import { AragonConfig } from './aragon.config';

@Module({
  imports: [],
  controllers: [],
  exports: [AragonService],
  providers: [AragonService, AragonProvider, AragonConfig],
})
export class AragonModule {}
