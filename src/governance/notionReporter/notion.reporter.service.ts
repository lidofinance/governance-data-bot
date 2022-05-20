import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../../common/config';
import { VoteEntity, votesIsEqual } from '../vote.entity';
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints';
import {
  NotionRecordEntity,
  voteFromNotionProperties,
} from './notion.record.entity';
import { NotionClientService } from './notion.client.service';

interface SourceAndNameToPageId {
  // Key is a tuple of source and name separated by |. Ex - Easytrack|#123
  [key: string]: { pageId: string; vote: VoteEntity };
}

@Injectable()
export class NotionReporterService {
  private readonly databaseId: string;
  private readonly logger = new Logger(NotionReporterService.name);

  constructor(
    protected readonly configService: ConfigService,
    protected readonly notion: NotionClientService,
  ) {
    this.databaseId = configService.get('NOTION_DATABASE_ID');
  }

  async report(votes: VoteEntity[]) {
    const records = await this.getRecords();
    let createdCount = 0;
    let updatedCount = 0;
    for (const vote of votes) {
      const properties = new NotionRecordEntity(vote).properties();
      const voteFromPage = records[`${vote.source}|${vote.name}`];
      if (voteFromPage !== undefined) {
        if (votesIsEqual(vote, voteFromPage.vote)) continue;
        await this.notion.pages.update({
          page_id: records[`${vote.source}|${vote.name}`].pageId,
          properties: properties,
        });
        updatedCount++;
      } else {
        await this.notion.pages.create({
          parent: { database_id: this.databaseId },
          properties: properties,
        });
        createdCount++;
      }
    }
    this.logger.log(
      `Reporting has completed. Created: ${createdCount}, Updated: ${updatedCount}`,
    );
  }

  async getRecords(): Promise<SourceAndNameToPageId> {
    const records: SourceAndNameToPageId = {};
    let has_more = true;
    let start_cursor;
    while (has_more) {
      const response: QueryDatabaseResponse = await this.notion.databases.query(
        {
          database_id: this.databaseId,
          page_size: 10,
          ...(start_cursor && { start_cursor: start_cursor }),
        },
      );
      response.results.map((item) => {
        if ('properties' in item) {
          const source =
            item.properties.Source.type === 'select' &&
            item.properties.Source.select.name;
          const name =
            item.properties.Name.type === 'title' &&
            item.properties.Name.title[0].plain_text;
          records[`${source}|${name}`] = {
            pageId: item.id,
            vote: voteFromNotionProperties(item.properties),
          };
        }
      });
      has_more = response.has_more;
      start_cursor = response.next_cursor;
    }
    return records;
  }
}
