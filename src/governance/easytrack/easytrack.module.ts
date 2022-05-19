import { Module } from '@nestjs/common';
import { EasytrackService } from './easytrack.service';
import { EasytrackProviderService } from './easytrack.provider.service';

@Module({
  imports: [],
  controllers: [],
  exports: [EasytrackService],
  providers: [EasytrackService, EasytrackProviderService],
})
export class EasytrackModule {}
