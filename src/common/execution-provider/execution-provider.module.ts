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
            async (next) => {
              const endTimer =
                prometheusService.elRpcRequestDuration.startTimer();

              try {
                const result = await next();
                endTimer({ result: 'success' });
                return result;
              } catch (error) {
                endTimer({ result: 'error' });
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
