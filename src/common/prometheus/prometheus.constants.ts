export const METRICS_URL = 'metrics';
export const METRICS_PREFIX = `${process.env.npm_package_name?.replace(
  /-|\ /g,
  '_',
)}_`;
