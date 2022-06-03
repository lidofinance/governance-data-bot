import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { ConfigService } from '../../common/config';
import { PrometheusService } from '../../common/prometheus';

export interface ResearchForumTopic {
  id: number;
  title: string;
  fancy_title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  highest_post_number: number;
  image_url: string | null;
  created_at: string;
  last_posted_at: string;
  bumped: boolean;
  bumped_at: string;
  archetype: string;
  unseen: boolean;
  pinned: boolean;
  unpinned: boolean | null;
  excerpt: string;
  visible: boolean;
  closed: boolean;
  archived: boolean;
  bookmarked: boolean | null;
  liked: boolean | null;
  tags_descriptions: object;
  views: number;
  like_count: number;
  has_summary: boolean;
  last_poster_username: string;
  category_id: number;
  pinned_globally: boolean;
  featured_link: string | null;
  has_accepted_answer: boolean;
  can_vote: boolean;
  posters: object[];
}
@Injectable()
export class ResearchForumProvider {
  public readonly baseUrl: string;
  constructor(
    private configService: ConfigService,
    private prometheusService: PrometheusService,
  ) {
    this.baseUrl = configService.get('RESEARCH_FORUM_DISCOURSE_URL');
  }
  async getLatestTopics(): Promise<ResearchForumTopic[]> {
    const r = await this.get<{ topic_list: { topics: ResearchForumTopic[] } }>(
      new URL('latest.json', this.baseUrl).href,
    );
    return r.topic_list.topics;
  }

  private async get<T>(url): Promise<T> {
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: ResearchForumProvider.name,
    });
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });
    if (!resp.ok)
      throw new Error(
        `Request ${resp.url} failed with ${
          resp.status
        } error: ${await resp.text()}`,
      );
    return (await resp.json()) as T;
  }
}
