import { Injectable, Logger } from '@nestjs/common';
import { ResearchForumProvider } from './research-forum.provider';
import { TopicEntity } from '../topic.entity';
import { formatDate } from '../governance.utils';
import { VoteEntity } from '../vote.entity';
import { ConfigService } from '../../common/config';

@Injectable()
export class ResearchForumService {
  private logger: Logger;
  constructor(
    private researchForumProvider: ResearchForumProvider,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(
      (this.configService.isDryRun() ? 'DryRun' : '') +
        ResearchForumService.name,
    );
  }

  async collect(): Promise<TopicEntity[]> {
    const forumTopics = await this.researchForumProvider.getLatestTopics();
    const topicEntities: TopicEntity[] = [];
    for (const topic of forumTopics) {
      topicEntities.push({
        id: topic.id,
        name: topic.title,
        link: new URL(
          `/t/${topic.slug}/${topic.id}/`,
          this.configService.get('RESEARCH_FORUM_DISCOURSE_URL'),
        ).href,
        creationDate: formatDate(topic.created_at),
        lastReplyDate: formatDate(topic.last_posted_at),
      });
    }
    return topicEntities;
  }

  async noPostsFromUserYet(message: string, topicUrl: string) {
    const firstLine = message.split('\n')[0];
    const user = await this.researchForumProvider.getCurrentUser();
    const posts = await this.researchForumProvider.getTopicPosts(topicUrl);
    const userPosts = posts.filter(
      (item) =>
        item.username == user.username && item.cooked.startsWith(firstLine),
    );
    return userPosts.length == 0;
  }

  async notifySnapshotVoteChange(message: string, vote: VoteEntity) {
    if (
      vote.discussion &&
      (await this.noPostsFromUserYet(message, vote.discussion))
    ) {
      const topic = await this.researchForumProvider.getTopic(vote.discussion);
      if (this.configService.isDryRun()) {
        this.logger.debug(`Notify to topic ${topic.id}`);
        return;
      }
      await this.researchForumProvider.createPost(Number(topic.id), message);
    }
  }
}
