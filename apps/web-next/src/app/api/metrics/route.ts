/**
 * Prometheus Metrics Endpoint for Next.js Application
 *
 * Exposes application metrics in Prometheus exposition format
 * Endpoint: GET /api/metrics
 *
 * Metrics tracked:
 * - http_requests_total: Total HTTP requests by method, status, route
 * - http_request_duration_seconds: Request duration histogram
 * - page_views_total: Total page views by route
 * - api_errors_total: API errors by endpoint and error type
 * - active_sessions: Current active user sessions
 * - lead_submissions_total: Total lead form submissions
 * - lead_submission_errors_total: Failed lead submissions
 * - cache_hits_total: Cache hits
 * - cache_misses_total: Cache misses
 */

import { NextRequest, NextResponse } from 'next/server';

// In-memory metrics storage
// In production, use Redis or a proper metrics library like prom-client
interface Metric {
  value: number;
  labels: Record<string, string>;
  timestamp: number;
}

// Global metrics store (should be replaced with Redis in production)
const metrics: Record<string, Metric[]> = {
  http_requests_total: [],
  http_request_duration_seconds: [],
  page_views_total: [],
  api_errors_total: [],
  lead_submissions_total: [],
  lead_submission_errors_total: [],
  cache_hits_total: [],
  cache_misses_total: [],
};

/**
 * Increment a counter metric
 */
export function incrementCounter(
  metricName: string,
  labels: Record<string, string> = {},
  value: number = 1
): void {
  if (!metrics[metricName]) {
    metrics[metricName] = [];
  }

  const labelKey = JSON.stringify(labels);
  const existing = metrics[metricName].find(
    (m) => JSON.stringify(m.labels) === labelKey
  );

  if (existing) {
    existing.value += value;
    existing.timestamp = Date.now();
  } else {
    metrics[metricName].push({
      value,
      labels,
      timestamp: Date.now(),
    });
  }
}

/**
 * Record a histogram value
 */
export function recordHistogram(
  metricName: string,
  value: number,
  labels: Record<string, string> = {}
): void {
  if (!metrics[metricName]) {
    metrics[metricName] = [];
  }

  metrics[metricName].push({
    value,
    labels,
    timestamp: Date.now(),
  });
}

/**
 * Set a gauge value
 */
export function setGauge(
  metricName: string,
  value: number,
  labels: Record<string, string> = {}
): void {
  if (!metrics[metricName]) {
    metrics[metricName] = [];
  }

  const labelKey = JSON.stringify(labels);
  const existing = metrics[metricName].find(
    (m) => JSON.stringify(m.labels) === labelKey
  );

  if (existing) {
    existing.value = value;
    existing.timestamp = Date.now();
  } else {
    metrics[metricName].push({
      value,
      labels,
      timestamp: Date.now(),
    });
  }
}

/**
 * Format labels for Prometheus
 */
function formatLabels(labels: Record<string, string>): string {
  const pairs = Object.entries(labels).map(
    ([key, value]) => `${key}="${value}"`
  );
  return pairs.length > 0 ? `{${pairs.join(',')}}` : '';
}

/**
 * Calculate histogram quantiles
 */
function calculateQuantiles(
  values: number[],
  quantiles: number[]
): Record<string, number> {
  const sorted = [...values].sort((a, b) => a - b);
  const result: Record<string, number> = {};

  for (const q of quantiles) {
    const index = Math.ceil(sorted.length * q) - 1;
    result[q.toString()] = sorted[Math.max(0, index)] || 0;
  }

  return result;
}

/**
 * Export metrics in Prometheus format
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const lines: string[] = [];

  // Add metadata
  lines.push('# Prometheus metrics for CEPComunicacion Next.js application');
  lines.push(`# Generated at: ${new Date().toISOString()}`);
  lines.push('');

  // Process counter metrics
  const counterMetrics = [
    'http_requests_total',
    'page_views_total',
    'api_errors_total',
    'lead_submissions_total',
    'lead_submission_errors_total',
    'cache_hits_total',
    'cache_misses_total',
  ];

  for (const metricName of counterMetrics) {
    if (metrics[metricName]?.length > 0) {
      lines.push(`# HELP ${metricName} Total count of ${metricName.replace(/_/g, ' ')}`);
      lines.push(`# TYPE ${metricName} counter`);

      for (const metric of metrics[metricName]) {
        const labels = formatLabels(metric.labels);
        lines.push(`${metricName}${labels} ${metric.value}`);
      }

      lines.push('');
    }
  }

  // Process histogram metrics
  if (metrics.http_request_duration_seconds?.length > 0) {
    lines.push('# HELP http_request_duration_seconds HTTP request duration in seconds');
    lines.push('# TYPE http_request_duration_seconds histogram');

    // Group by label combination
    const groupedByLabels = new Map<string, number[]>();

    for (const metric of metrics.http_request_duration_seconds) {
      const labelKey = JSON.stringify(metric.labels);
      if (!groupedByLabels.has(labelKey)) {
        groupedByLabels.set(labelKey, []);
      }
      groupedByLabels.get(labelKey)!.push(metric.value);
    }

    // Calculate quantiles for each label group
    groupedByLabels.forEach((values, labelKey) => {
      const labels = JSON.parse(labelKey);
      const quantiles = calculateQuantiles(values, [0.5, 0.9, 0.95, 0.99]);

      for (const [quantile, value] of Object.entries(quantiles)) {
        const labelsStr = formatLabels({ ...labels, quantile });
        lines.push(`http_request_duration_seconds${labelsStr} ${value.toFixed(3)}`);
      }

      // Add count and sum
      const labelsStr = formatLabels(labels);
      lines.push(`http_request_duration_seconds_count${labelsStr} ${values.length}`);
      lines.push(
        `http_request_duration_seconds_sum${labelsStr} ${values.reduce((a, b) => a + b, 0).toFixed(3)}`
      );
    });

    lines.push('');
  }

  // Add system metrics from Next.js
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const memUsage = process.memoryUsage();

    lines.push('# HELP nodejs_memory_usage_bytes Node.js memory usage in bytes');
    lines.push('# TYPE nodejs_memory_usage_bytes gauge');
    lines.push(`nodejs_memory_usage_bytes{type="rss"} ${memUsage.rss}`);
    lines.push(`nodejs_memory_usage_bytes{type="heapTotal"} ${memUsage.heapTotal}`);
    lines.push(`nodejs_memory_usage_bytes{type="heapUsed"} ${memUsage.heapUsed}`);
    lines.push(`nodejs_memory_usage_bytes{type="external"} ${memUsage.external}`);
    lines.push('');

    lines.push('# HELP nodejs_uptime_seconds Node.js uptime in seconds');
    lines.push('# TYPE nodejs_uptime_seconds counter');
    lines.push(`nodejs_uptime_seconds ${process.uptime()}`);
    lines.push('');
  }

  // Add custom business metrics
  try {
    // Example: Query database for business metrics
    // This would be replaced with actual database queries
    lines.push('# HELP leads_total Total number of leads');
    lines.push('# TYPE leads_total gauge');
    lines.push(`leads_total 0`); // Placeholder - replace with actual query
    lines.push('');

    lines.push('# HELP active_sessions Current active user sessions');
    lines.push('# TYPE active_sessions gauge');
    lines.push(`active_sessions 0`); // Placeholder - replace with actual session count
    lines.push('');
  } catch (error) {
    console.error('Error fetching business metrics:', error);
  }

  return new NextResponse(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

// Export helper functions for use in other parts of the application
export { incrementCounter as trackCounter, recordHistogram as trackHistogram, setGauge as trackGauge };
