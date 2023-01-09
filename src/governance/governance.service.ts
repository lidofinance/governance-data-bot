import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EasyTrackService } from './easy-track/easy-track.service';
import { NotionReporterService } from './notionReporter/notion.reporter.service';
import { PrometheusService } from '../common/prometheus';
import { SnapshotService } from './snapshot/snapshot.service';
import { VoteSources } from './vote.entity';
import { AragonService } from './aragon/aragon.service';
import { ResearchForumService } from './research-forum/research-forum.service';
import { ConfigService, Network } from '../common/config';

enum TaskStatus {
  passed = 'passed',
  failed = 'failed',
}

const EVERY_10_MINUTES_OFFSET_3 = '0 3-59/10 * * * *';
const EVERY_10_MINUTES_OFFSET_6 = '0 6-59/10 * * * *';
const EVERY_10_MINUTES_OFFSET_8 = '0 8-59/10 * * * *';

@Injectable()
export class GovernanceService {
  private readonly logger: Logger = new Logger(GovernanceService.name);
  constructor(
    private configService: ConfigService,
    private easyTrackService: EasyTrackService,
    private snapshotService: SnapshotService,
    private aragonService: AragonService,
    private researchForumService: ResearchForumService,
    private notionReporterService: NotionReporterService,
    private prometheusService: PrometheusService,
  ) {}

  async startTask(name: string, func: () => void) {
    const stop = this.prometheusService.taskDuration.startTimer({ name });
    try {
      await func();
      this.prometheusService.taskCount.inc({ name, status: TaskStatus.passed });
    } catch (error) {
      this.logger.error(
        `An error occurred when task ${name} executed:`,
        error.stack,
      );
      this.prometheusService.taskCount.inc({ name, status: TaskStatus.failed });
    }
    stop();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async updateEasyTrackRecords() {
    await this.startTask('update-EasyTrack-records', async () => {
      this.logger.log('Started updating EasyTrack records');
      const records = await this.notionReporterService.getVoteRecords();
      const ids = Object.values(records)
        .filter((value) => value.vote.source === VoteSources.easyTrack)
        .map((value) => Number(value.vote.name.replace('#', '')));
      const votes = await this.easyTrackService.collectNewAndRefresh(ids);
      await this.notionReporterService.reportVotes(votes);
      this.logger.log('EasyTrack records are up to date');
    });
  }

  @Cron(EVERY_10_MINUTES_OFFSET_3)
  async updateSnapshotRecords() {
    if (this.configService.get('NETWORK') == Network.goerli) {
      this.logger.warn(
        `There is no ${Network.goerli} config for Snapshot service`,
      );
      return;
    }
    await this.startTask('update-Snapshot-records', async () => {
      this.logger.log('Started updating Snapshot records');
      const records = await this.notionReporterService.getVoteRecords();
      const previousVotes = Object.values(records)
        .map((record) => record.vote)
        .filter((value) => value.source === VoteSources.snapshot);
      const ids = previousVotes.map(
        (value) => value.link.split('/').slice(-1)[0],
      );
      const votes = await this.snapshotService.collectNewAndRefresh(ids);
      await this.notionReporterService.reportVotes(votes);
      await Promise.all(
        votes.map(async (vote) => {
          const message = await this.snapshotService.getChangesMessage(
            previousVotes,
            vote,
          );
          if (message)
            await this.researchForumService.notifySnapshotVoteChange(
              message,
              vote,
            );
        }),
      );
      this.logger.log('Snapshot records are up to date');
    });
  }

  @Cron(EVERY_10_MINUTES_OFFSET_6)
  async updateAragonRecords() {
    await this.startTask('update-Aragon-records', async () => {
      this.logger.log('Started updating Aragon records');
      const records = await this.notionReporterService.getVoteRecords();
      const ids = Object.values(records)
        .filter((value) => value.vote.source === VoteSources.aragon)
        .map((value) => Number(value.vote.name.replace('#', '')));
      const votes = await this.aragonService.collectNewAndRefresh(ids);
      await this.notionReporterService.reportVotes(votes);
      this.logger.log('Aragon records are up to date');
    });
  }

  @Cron(EVERY_10_MINUTES_OFFSET_8)
  async updateResearchForumRecords() {
    if (this.configService.get('NETWORK') == Network.goerli) {
      this.logger.warn(
        `There is no ${Network.goerli} config for Research forum service`,
      );
      return;
    }
    await this.startTask('update-ResearchForum-records', async () => {
      this.logger.log('Started updating Research Forum records');
      const topics = await this.researchForumService.collect();
      await this.notionReporterService.reportTopics(topics);
      this.logger.log('Research Forum records are up to date');
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async fullSyncEasyTrackRecords() {
    await this.startTask('daily-EasyTrack-sync', async () => {
      this.logger.log('Started daily EasyTrack records sync');
      const votes = await this.easyTrackService.collectByMaxPastDays();
      await this.notionReporterService.reportVotes(votes);
      this.logger.log('Daily EasyTrack records sync is done');
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async fullSyncSnapshotRecords() {
    if (this.configService.get('NETWORK') == Network.goerli) {
      this.logger.warn(
        `There is no ${Network.goerli} config for Snapshot service`,
      );
      return;
    }
    await this.startTask('daily-Snapshot-sync', async () => {
      this.logger.log('Started daily Snapshot records sync');
      const votes = await this.snapshotService.collectByMaxPastDays();
      await this.notionReporterService.reportVotes(votes);
      this.logger.log('Daily Snapshot records sync is done');
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async fullSyncAragonRecords() {
    await this.startTask('daily-Aragon-sync', async () => {
      this.logger.log('Started daily Aragon records sync');
      const votes = await this.aragonService.collectByMaxPastDays();
      await this.notionReporterService.reportVotes(votes);
      this.logger.log('Daily Aragon records sync is done');
    });
  }
}
