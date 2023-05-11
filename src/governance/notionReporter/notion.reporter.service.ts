import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../../common/config';
import { VoteEntity } from '../vote.entity';
import {
  isValidProperties,
  NotionEntity,
  NotionTopicEntity,
  NotionVoteEntity,
  topicFromNotionProperties,
  voteFromNotionProperties,
} from './notion.record.entity';
import { NotionClientService } from './notion.client.service';
import { objectsAreEqual } from '../governance.utils';
import { TopicEntity } from '../topic.entity';

interface SourceAndNameToVotePage {
  // Key is a tuple of source and name separated by |. Ex - EasyTrack|#123
  [key: string]: { pageId: string; vote: VoteEntity };
}

interface LinkToTopicPage {
  // Key is a link to the forum topic
  [key: string]: { pageId: string; topic: TopicEntity };
}

@Injectable()
export class NotionReporterService {
  private readonly votesDatabaseId: string;
  private readonly topicsDatabaseId: string;
  private readonly logger: Logger;

  constructor(
    protected readonly configService: ConfigService,
    protected readonly notion: NotionClientService,
  ) {
    this.votesDatabaseId = configService.get('NOTION_VOTES_DATABASE_ID');
    this.topicsDatabaseId = configService.get('NOTION_TOPICS_DATABASE_ID');
    this.logger = new Logger(
      (this.configService.isDryRun() ? 'DryRun' : '') +
        NotionReporterService.name,
    );
  }

  async reportVotes(votes: VoteEntity[]) {
    const records = await this.getVoteRecords();
    let createdCount = 0;
    let updatedCount = 0;
    for (const vote of votes) {
      if (!vote.source || !vote.name) {
        this.logger.warn(
          `Vote ${JSON.stringify(vote)} is missing source or name`,
        );
        continue;
      }
      const properties = new NotionVoteEntity(vote).properties();
      const voteFromPage = records[`${vote.source}|${vote.name}`];
      if (voteFromPage !== undefined) {
        if (objectsAreEqual(vote, voteFromPage.vote)) continue;
        if (!this.configService.isDryRun())
          await this.notion.pages.update({
            page_id: records[`${vote.source}|${vote.name}`].pageId,
            properties: properties,
          });
        updatedCount++;
      } else {
        if (!this.configService.isDryRun())
          await this.notion.pages.create({
            parent: { database_id: this.votesDatabaseId },
            properties: properties,
          });
        createdCount++;
      }
    }
    this.logger.log(
      `Reporting has completed. Created: ${createdCount}, Updated: ${updatedCount}`,
    );
  }

  async reportTopics(topics: TopicEntity[]) {
    const records = await this.getTopicRecords();
    let createdCount = 0;
    let updatedCount = 0;
    for (const topic of topics) {
      const properties = new NotionTopicEntity(topic).properties();
      const topicFromPage = records[topic.id];
      if (topicFromPage !== undefined) {
        if (objectsAreEqual(topic, topicFromPage.topic)) continue;
        if (!this.configService.isDryRun())
          await this.notion.pages.update({
            page_id: records[topic.id].pageId,
            properties: properties,
          });
        updatedCount++;
      } else {
        if (!this.configService.isDryRun())
          await this.notion.pages.create({
            parent: { database_id: this.topicsDatabaseId },
            properties: properties,
          });
        createdCount++;
      }
    }
    this.logger.log(
      `Reporting has completed. Created: ${createdCount}, Updated: ${updatedCount}`,
    );
  }

  async getVoteRecords(): Promise<SourceAndNameToVotePage> {
    const records: SourceAndNameToVotePage = {};
    const synced = await this.syncDatabaseSchema(
      this.votesDatabaseId,
      NotionVoteEntity,
    );
    if (synced && this.configService.isDryRun()) return records;
    for await (const item of this.notion.queryDatabase(this.votesDatabaseId)) {
      if ('properties' in item) {
        const source =
          item.properties.Source.type === 'select' &&
          item.properties.Source.select?.name;
        const name =
          item.properties.Name.type === 'title' &&
          item.properties.Name.title[0]?.plain_text;
        if (!source || !name) {
          this.logger.warn(
            `Skipping vote with missing 'Source' or 'Name': ${item.properties}`,
          );
          continue;
        }
        records[`${source}|${name}`] = {
          pageId: item.id,
          vote: voteFromNotionProperties(item.properties),
        };
      }
    }
    return records;
  }

  async getTopicRecords(): Promise<LinkToTopicPage> {
    const records: LinkToTopicPage = {};
    const synced = await this.syncDatabaseSchema(
      this.topicsDatabaseId,
      NotionTopicEntity,
    );
    if (synced && this.configService.isDryRun()) return records;
    for await (const item of this.notion.queryDatabase(this.topicsDatabaseId)) {
      if ('properties' in item) {
        const id =
          item.properties.ID?.type === 'number' && item.properties.ID.number;
        if (!id) continue;
        records[id] = {
          pageId: item.id,
          topic: topicFromNotionProperties(item.properties),
        };
      }
    }
    return records;
  }

  async syncDatabaseSchema(
    databaseId,
    entity: typeof NotionEntity,
  ): Promise<boolean> {
    const database = await this.notion.databases.retrieve({
      database_id: databaseId,
    });
    if (!isValidProperties(entity.propertiesNames, database.properties)) {
      if (!this.configService.isDryRun())
        await this.notion.databases.update({
          database_id: databaseId,
          properties: entity.schema(),
        });
      this.logger.log(`Updated ${entity.name} database schema`);
      return true;
    }
    return false;
  }
}
