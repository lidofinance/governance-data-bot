import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EasyTrackService } from './easy-track/easy-track.service';
import { NotionReporterService } from './notionReporter/notion.reporter.service';
import { PrometheusService } from '../common/prometheus';
import { SnapshotService } from './snapshot/snapshot.service';
import { VoteSources } from './vote.entity';

enum TaskStatus {
  passed = 'passed',
  failed = 'failed',
}

const EVERY_10_MINUTES_OFFSET_3 = '0 3-59/10 * * * *';

@Injectable()
export class GovernanceService {
  private readonly logger: Logger = new Logger(GovernanceService.name);
  constructor(
    private easyTrackService: EasyTrackService,
    private snapshotService: SnapshotService,
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
      const records = await this.notionReporterService.getRecords();
      const ids = Object.values(records)
        .filter((value) => value.vote.source === VoteSources.easyTrack)
        .map((value) => Number(value.vote.name.replace('#', '')));
      const votes = await this.easyTrackService.collectByIds(ids);
      await this.notionReporterService.report(votes);
    });
  }

  @Cron(EVERY_10_MINUTES_OFFSET_3)
  async updateSnapshotRecords() {
    await this.startTask('update-Snapshot-records', async () => {
      this.logger.log('Started updating Snapshot records');
      const records = await this.notionReporterService.getRecords();
      const ids = Object.values(records)
        .filter((value) => value.vote.source === VoteSources.snapshot)
        .map((value) => value.vote.link.split('/').slice(-1)[0]);
      const votes = await this.snapshotService.collectByIds(ids);
      await this.notionReporterService.report(votes);
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async fullSyncEasyTrackRecords() {
    await this.startTask('daily-EasyTrack-sync', async () => {
      this.logger.log('Started daily EasyTrack records sync');
      const votes = await this.easyTrackService.collectByMaxPastDays();
      await this.notionReporterService.report(votes);
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async fullSyncSnapshotRecords() {
    await this.startTask('daily-Snapshot-sync', async () => {
      this.logger.log('Started daily Snapshot records sync');
      const votes = await this.snapshotService.collectByMaxPastDays();
      await this.notionReporterService.report(votes);
    });
  }
}
