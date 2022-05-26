import { Module } from '@nestjs/common';
import { SnapshotGraphqlService } from './snapshot.graphql.service';
import { SnapshotService } from './snapshot.service';

@Module({
  imports: [],
  controllers: [],
  exports: [],
  providers: [SnapshotService, SnapshotGraphqlService],
})
export class SnapshotModule {}
