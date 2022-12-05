import {
  jsonTransport,
  simpleTransport,
  LoggerModule as Logger,
} from '@lido-nestjs/logger';
import { ConfigModule, ConfigService, LogFormat } from '../config';

export const LoggerModule = Logger.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const { secrets } = configService;
    const level = configService.get('LOG_LEVEL');
    const format = configService.get('LOG_FORMAT');
    const isJSON = format === LogFormat.json;

    const transports = isJSON
      ? jsonTransport({ secrets })
      : simpleTransport({ secrets });

    return { level, transports };
  },
});
