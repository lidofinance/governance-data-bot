import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '../../common/config';
import { VoteEntity } from '../vote.entity';
import {
  isValidProperties,
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
  private readonly logger = new Logger(NotionReporterService.name);

  constructor(
    protected readonly configService: ConfigService,
    protected readonly notion: NotionClientService,
  ) {
    this.votesDatabaseId = configService.get('NOTION_VOTES_DATABASE_ID');
    this.topicsDatabaseId = configService.get('NOTION_TOPICS_DATABASE_ID');
  }

  async reportVotes(votes: VoteEntity[]) {
    const records = await this.getVoteRecords();
    let createdCount = 0;
    let updatedCount = 0;
    for (const vote of votes) {
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
      `${this.configService.isDryRun() ? '[Dry Run] ' : ''}` +
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
      `${this.configService.isDryRun() ? '[Dry Run] ' : ''}` +
        `Reporting has completed. Created: ${createdCount}, Updated: ${updatedCount}`,
    );
  }

  async getVoteRecords(): Promise<SourceAndNameToVotePage> {
    const records: SourceAndNameToVotePage = {};
    for await (const item of this.notion.queryDatabase(this.votesDatabaseId)) {
      if ('properties' in item) {
        if (
          !isValidProperties(NotionVoteEntity.propertiesNames, item.properties)
        ) {
          if (this.configService.isDryRun()) return records;
          await this.updateProperties(
            this.votesDatabaseId,
            NotionVoteEntity.schema(),
          );
          this.logger.debug('Vote properties updating');
        }
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
    }
    return records;
  }

  async getTopicRecords(): Promise<LinkToTopicPage> {
    const records: LinkToTopicPage = {};
    for await (const item of this.notion.queryDatabase(this.topicsDatabaseId)) {
      if ('properties' in item) {
        if (
          !isValidProperties(NotionTopicEntity.propertiesNames, item.properties)
        ) {
          this.logger.debug('Topic properties updating');
          if (this.configService.isDryRun()) return records;
          await this.updateProperties(
            this.topicsDatabaseId,
            NotionTopicEntity.schema(),
          );
        }
        const id =
          item.properties.ID.type === 'number' && item.properties.ID.number;
        records[id] = {
          pageId: item.id,
          topic: topicFromNotionProperties(item.properties),
        };
      }
    }
    return records;
  }

  async updateProperties(databaseId, schema): Promise<void> {
    await this.notion.databases.update({
      database_id: databaseId,
      properties: schema,
    });
  }
}
