import { Injectable } from '@nestjs/common';
import { ResearchForumProvider } from './research-forum.provider';
import { TopicEntity } from '../topic.entity';
import { formatDate } from '../governance.utils';

@Injectable()
export class ResearchForumService {
  constructor(private researchForumProvider: ResearchForumProvider) {}

  async collect(): Promise<TopicEntity[]> {
    const forumTopics = await this.researchForumProvider.getLatestTopics();
    const topicEntities: TopicEntity[] = [];
    for (const topic of forumTopics) {
      topicEntities.push({
        id: topic.id,
        name: topic.title,
        link: new URL(
          `/t/${topic.slug}/${topic.id}/`,
          this.researchForumProvider.baseUrl,
        ).href,
        creationDate: formatDate(topic.created_at),
        lastReplyDate: formatDate(topic.last_posted_at),
      });
    }
    return topicEntities;
  }
}
