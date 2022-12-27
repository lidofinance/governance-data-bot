import { Injectable } from '@nestjs/common';
import fetch, { HeadersInit } from 'node-fetch';
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

export interface ResearchForumPost {
  username: string;
  cooked: string;
  created_at: string;
}

export interface ResearchForumUser {
  username: string;
}
@Injectable()
export class ResearchForumProvider {
  public readonly baseUrl: string;
  public readonly token: string;
  private readonly headers: HeadersInit;
  constructor(
    private configService: ConfigService,
    private prometheusService: PrometheusService,
  ) {
    this.baseUrl = configService.get('RESEARCH_FORUM_DISCOURSE_URL');
    this.token = configService.get('RESEARCH_FORUM_API_TOKEN');
    this.headers = {
      'Content-type': 'application/json',
    };
    if (this.token) {
      this.headers['Api-Key'] = this.token;
    }
  }
  async getLatestTopics(): Promise<ResearchForumTopic[]> {
    const r = await this.get<{ topic_list: { topics: ResearchForumTopic[] } }>(
      new URL('latest.json', this.baseUrl).href,
    );
    return r.topic_list.topics;
  }

  async getTopicPosts(topicUrl): Promise<ResearchForumPost[]> {
    const r = await this.get<{ post_stream: { posts: ResearchForumPost[] } }>(
      topicUrl + '.json',
    );
    return r.post_stream.posts;
  }

  async getTopic(topicUrl): Promise<ResearchForumTopic> {
    return await this.get<ResearchForumTopic>(topicUrl + '.json');
  }

  async getCurrentUser() {
    const r = await this.get<{ current_user: ResearchForumUser }>(
      new URL('session/current.json', this.baseUrl).href,
    );
    return r.current_user;
  }

  async createPost(topicId: number, content: string): Promise<void> {
    await this.post(new URL('posts.json', this.baseUrl).href, {
      topic_id: topicId,
      raw: content,
    });
  }

  private async get<T>(url): Promise<T> {
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: ResearchForumProvider.name,
    });
    const resp = await fetch(url, {
      method: 'GET',
      headers: this.headers,
    });
    if (!resp.ok)
      throw new Error(
        `Request failed with ${resp.status} error: ${await resp.text()}`,
      );
    return (await resp.json()) as T;
  }

  private async post<T>(url, body): Promise<T> {
    if (!this.token)
      throw Error(
        'You should specify research forum token if you want to post topics',
      );
    this.prometheusService.externalServiceRequestsCount.inc({
      serviceName: ResearchForumProvider.name,
    });
    const resp = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body),
    });
    if (!resp.ok)
      throw new Error(
        `Request failed with ${resp.status} error: ${await resp.text()}`,
      );
    return (await resp.json()) as T;
  }
}
