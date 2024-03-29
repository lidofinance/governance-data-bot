import { Injectable, Logger } from '@nestjs/common';
import { ResearchForumProvider } from './research-forum.provider';
import { TopicEntity } from '../topic.entity';
import { formatDate } from '../governance.utils';
import { VoteEntity, VoteStatus } from '../vote.entity';
import { ConfigService } from '../../common/config';

@Injectable()
export class ResearchForumService {
  private logger: Logger;
  constructor(
    private researchForumProvider: ResearchForumProvider,
    private configService: ConfigService,
  ) {
    this.logger = new Logger(
      (this.configService.isDryRun() ? 'DryRun' : '') + ResearchForumService.name,
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

  async noPostsFromUserYet(vote: VoteEntity) {
    let voteDate: Date;
    switch (vote.status) {
      case VoteStatus.active:
        voteDate = new Date(vote.startDate);
        break;
      case VoteStatus.closed:
        voteDate = new Date(vote.endDate);
        break;
      default:
        this.logger.warn('Unexpected vote status ' + vote.status + ' for vote ' + vote.link);
        return false;
    }
    const user = await this.researchForumProvider.getCurrentUser();
    const posts = await this.researchForumProvider.getTopicPosts(vote.discussion);
    const userPosts = posts.filter(
      (item) =>
        item.username == user.username &&
        item.cooked.includes(vote.link) &&
        new Date(item.created_at) > voteDate,
    );
    return userPosts.length == 0;
  }

  async notifySnapshotVoteChange(message: string, vote: VoteEntity) {
    if (!vote.discussion) return;
    if (!vote.discussion.startsWith(this.configService.get('RESEARCH_FORUM_DISCOURSE_URL'))) {
      this.logger.warn('Suspicious discussion URL for vote ' + vote.link);
      return;
    }
    if (await this.noPostsFromUserYet(vote)) {
      const topic = await this.researchForumProvider.getTopic(vote.discussion);
      this.logger.debug(`Notify snapshot status ${vote.status} to topic ${topic.id}`);
      if (this.configService.isDryRun()) {
        return;
      }
      await this.researchForumProvider.createPost(Number(topic.id), message);
    }
  }
}
