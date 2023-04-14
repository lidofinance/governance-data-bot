import { Global, Module } from '@nestjs/common';
import { EtherscanProviderService } from './etherscan-provider.service';
import { ExecutionProviderModule } from '../execution-provider';

@Global()
@Module({
  imports: [ExecutionProviderModule],
  providers: [EtherscanProviderService],
  exports: [EtherscanProviderService],
})
export class EtherscanProviderModule {}
