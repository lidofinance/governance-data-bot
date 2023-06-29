import { Module } from '@nestjs/common';
import { SnapshotGraphqlService } from './snapshot.graphql.service';
import { SnapshotService } from './snapshot.service';
import { SnapshotConfig } from './snapshot.config';
import { FetchModule } from '@lido-nestjs/fetch';
import { ConfigService } from '../../common/config';

@Module({
  imports: [
    FetchModule.forFeatureAsync({
      async useFactory(configService: ConfigService) {
        return {
          baseUrls: [configService.get('SNAPSHOT_PROPOSALS_GRAPHQL_URL')],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  exports: [SnapshotService],
  providers: [SnapshotService, SnapshotGraphqlService, SnapshotConfig],
})
export class SnapshotModule {}
