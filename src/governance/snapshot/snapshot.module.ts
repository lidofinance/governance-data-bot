import { Module } from '@nestjs/common';
import { SnapshotGraphqlService } from './snapshot.graphql.service';
import { SnapshotService } from './snapshot.service';
import { SnapshotConfig } from './snapshot.config';

@Module({
  imports: [],
  controllers: [],
  exports: [SnapshotService],
  providers: [SnapshotService, SnapshotGraphqlService, SnapshotConfig],
})
export class SnapshotModule {}
