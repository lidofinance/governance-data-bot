import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EasyTrackService } from './easy-track/easy-track.service';
import { NotionReporterService } from './notionReporter/notion.reporter.service';
import { PrometheusService } from '../common/prometheus';

enum TaskStatus {
  passed = 'passed',
  failed = 'failed',
}

@Injectable()
export class GovernanceService {
  private readonly logger: Logger = new Logger(GovernanceService.name);
  constructor(
    private easyTrackService: EasyTrackService,
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
        `An error occurred when task ${name} executed:\n`,
        error,
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
      const ids = Object.values(records).map((value) =>
        Number(value.vote.name.replace('#', '')),
      );
      const votes = await this.easyTrackService.collectByIds(ids);
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
}
