import { Global, Module } from '@nestjs/common';
import { FallbackProviderModule } from '@lido-nestjs/execution';
import { NonEmptyArray } from '@lido-nestjs/execution/dist/interfaces/non-empty-array';
import { PrometheusService } from '../prometheus';
import { ConfigService } from '../config';

@Global()
@Module({
  imports: [
    FallbackProviderModule.forRootAsync({
      async useFactory(
        configService: ConfigService,
        prometheusService: PrometheusService,
      ) {
        const urls = configService.get('EL_RPC_URLS') as NonEmptyArray<string>;
        const network = configService.chainId();

        return {
          urls,
          network,
          fetchMiddlewares: [
            async (next, ctx) => {
              const url = new URL(ctx?.provider?.connection?.url);
              const endTimer =
                prometheusService.elRpcRequestDuration.startTimer();

              try {
                const result = await next();
                endTimer({ result: 'success', provider: url.hostname });
                return result;
              } catch (error) {
                endTimer({ result: 'error', provider: url.hostname });
                throw error;
              }
            },
          ],
        };
      },
      inject: [ConfigService, PrometheusService],
    }),
  ],
  providers: [],
  exports: [],
})
export class ExecutionProviderModule {}
