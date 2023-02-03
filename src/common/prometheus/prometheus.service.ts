import { getOrCreateMetric } from '@willsoto/nestjs-prometheus';
import { Options, Metrics, Metric } from './interfaces';
import { METRICS_PREFIX } from './prometheus.constants';

export class PrometheusService {
  private prefix = METRICS_PREFIX;

  private getOrCreateMetric<T extends Metrics, L extends string>(
    type: T,
    options: Options<L>,
  ): Metric<T, L> {
    const nameWithPrefix = this.prefix + options.name;

    return getOrCreateMetric(type, {
      ...options,
      name: nameWithPrefix,
    }) as Metric<T, L>;
  }

  public httpRequestDuration = this.getOrCreateMetric('Histogram', {
    name: 'http_requests_duration_seconds',
    help: 'Duration of http requests',
    buckets: [0.01, 0.1, 0.2, 0.5, 1, 1.5, 2, 5],
    labelNames: ['statusCode', 'method', 'pathname'] as const,
  });

  public buildInfo = this.getOrCreateMetric('Gauge', {
    name: 'build_info',
    help: 'Build information',
    labelNames: ['name', 'version', 'env', 'network', 'commit', 'branch'],
  });

  public taskDuration = this.getOrCreateMetric('Histogram', {
    name: 'task_duration_seconds',
    help: 'Duration of task execution',
    buckets: [2, 5, 10, 30, 60, 120, 240, 400],
    labelNames: ['name'],
  });

  public taskCount = this.getOrCreateMetric('Counter', {
    name: 'task_result_count',
    help: 'Count of passed or failed tasks',
    labelNames: ['name', 'status'],
  });

  public externalServiceRequestsCount = this.getOrCreateMetric('Counter', {
    name: 'external_service_requests_count',
    help: 'Requests count to some external services',
    labelNames: ['serviceName'],
  });

  public elRpcRequestDuration = this.getOrCreateMetric('Histogram', {
    name: 'el_rpc_requests_duration_seconds',
    help: 'EL RPC request duration',
    buckets: [0.1, 0.2, 0.3, 0.6, 1, 1.5, 2, 5],
    labelNames: ['result', 'provider'],
  });
}
