import { Module } from '@nestjs/common';
import { GraphqlService } from './graphql.service';

@Module({
  imports: [],
  controllers: [],
  exports: [GraphqlService],
  providers: [GraphqlService],
})
export class GraphqlModule {}
