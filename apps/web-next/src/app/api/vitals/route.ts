/**
 * Web Vitals Reporting Endpoint
 *
 * Receives and stores Core Web Vitals metrics from the Next.js application
 * Endpoint: POST /api/vitals
 *
 * Core Web Vitals tracked:
 * - FCP (First Contentful Paint) - measures loading performance
 * - LCP (Largest Contentful Paint) - measures loading performance
 * - FID (First Input Delay) - measures interactivity
 * - CLS (Cumulative Layout Shift) - measures visual stability
 * - TTFB (Time to First Byte) - measures server response time
 * - INP (Interaction to Next Paint) - measures responsiveness
 *
 * Data flow:
 * 1. Client-side Next.js app sends metrics via reportWebVitals()
 * 2. This endpoint receives and validates metrics
 * 3. Metrics are stored in database or forwarded to analytics service
 * 4. Aggregated metrics are exposed via /api/metrics for Prometheus
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Web Vitals metric interface
 */
interface WebVitalsMetric {
  id: string;
  name: 'FCP' | 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: 'navigate' | 'reload' | 'back-forward' | 'prerender';
  label?: string;
}

/**
 * Request body interface
 */
interface WebVitalsPayload extends WebVitalsMetric {
  // Additional context
  url: string;
  userAgent?: string;
  connectionType?: string;
  deviceMemory?: number;
  timestamp: number;
}

/**
 * Validate metric value ranges
 */
function validateMetric(metric: WebVitalsPayload): { valid: boolean; error?: string } {
  const { name, value } = metric;

  // Define thresholds (in milliseconds or units)
  const thresholds: Record<string, { good: number; needsImprovement: number }> = {
    FCP: { good: 1800, needsImprovement: 3000 }, // ms
    LCP: { good: 2500, needsImprovement: 4000 }, // ms
    FID: { good: 100, needsImprovement: 300 }, // ms
    CLS: { good: 0.1, needsImprovement: 0.25 }, // score
    TTFB: { good: 800, needsImprovement: 1800 }, // ms
    INP: { good: 200, needsImprovement: 500 }, // ms
  };

  if (!thresholds[name]) {
    return { valid: false, error: `Unknown metric name: ${name}` };
  }

  // Check if value is within reasonable bounds
  if (value < 0) {
    return { valid: false, error: 'Metric value cannot be negative' };
  }

  if (value > 60000 && name !== 'CLS') {
    // 60 seconds max (except for CLS which is unitless)
    return { valid: false, error: 'Metric value exceeds maximum threshold' };
  }

  return { valid: true };
}

/**
 * Calculate rating based on thresholds
 */
function calculateRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, { good: number; needsImprovement: number }> = {
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    FID: { good: 100, needsImprovement: 300 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    TTFB: { good: 800, needsImprovement: 1800 },
    INP: { good: 200, needsImprovement: 500 },
  };

  const threshold = thresholds[name];
  if (!threshold) return 'poor';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * Store metric in database
 */
async function storeMetric(metric: WebVitalsPayload): Promise<void> {
  try {
    // TODO: Store in database
    // Example: await db.webVitals.create({ data: metric });

    // For now, log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        url: metric.url,
      });
    }

    // Update Prometheus metrics
    const { incrementCounter } = await import('../metrics/route');
    incrementCounter('web_vitals_total', {
      name: metric.name,
      rating: metric.rating,
      navigation_type: metric.navigationType,
    });
  } catch (error) {
    console.error('Error storing web vital metric:', error);
    throw error;
  }
}

/**
 * Send metric to external analytics service
 */
async function sendToAnalytics(metric: WebVitalsPayload): Promise<void> {
  try {
    // Send to Google Analytics 4
    if (process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID) {
      // GA4 event format
      const gaEvent = {
        name: 'web_vitals',
        params: {
          event_category: 'Web Vitals',
          event_label: metric.name,
          value: Math.round(metric.value),
          metric_rating: metric.rating,
          metric_delta: Math.round(metric.delta),
          metric_id: metric.id,
        },
      };

      // Send to GA4 Measurement Protocol (server-side)
      const ga4MeasurementId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
      const ga4ApiSecret = process.env.GA4_API_SECRET;

      if (ga4ApiSecret) {
        await fetch(
          `https://www.google-analytics.com/mp/collect?measurement_id=${ga4MeasurementId}&api_secret=${ga4ApiSecret}`,
          {
            method: 'POST',
            body: JSON.stringify({
              client_id: metric.id,
              events: [gaEvent],
            }),
          }
        );
      }
    }

    // Send to other analytics services (Plausible, Mixpanel, etc.)
    // if (process.env.PLAUSIBLE_DOMAIN) {
    //   await fetch('https://plausible.io/api/event', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       name: `web-vital-${metric.name}`,
    //       url: metric.url,
    //       domain: process.env.PLAUSIBLE_DOMAIN,
    //       props: {
    //         value: metric.value,
    //         rating: metric.rating,
    //       },
    //     }),
    //   });
    // }
  } catch (error) {
    console.error('Error sending metric to analytics:', error);
    // Don't throw - analytics failures shouldn't break the endpoint
  }
}

/**
 * Main handler for Web Vitals reporting
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse request body
    const body = (await request.json()) as WebVitalsPayload;

    // Validate required fields
    if (!body.name || !body.value || !body.id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, value, id' },
        { status: 400 }
      );
    }

    // Validate metric
    const validation = validateMetric(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Ensure rating is correct
    body.rating = calculateRating(body.name, body.value);

    // Store metric in database
    await storeMetric(body);

    // Send to external analytics (non-blocking)
    sendToAnalytics(body).catch((error) => {
      console.error('Analytics error:', error);
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Metric recorded successfully',
        metric: {
          name: body.name,
          value: body.value,
          rating: body.rating,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error processing web vitals:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to retrieve aggregated Web Vitals statistics
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get('range') || '24h'; // 1h, 24h, 7d, 30d
    const metricName = searchParams.get('metric'); // Filter by specific metric

    // TODO: Query database for aggregated metrics
    // Example query:
    // const stats = await db.webVitals.aggregate({
    //   where: {
    //     timestamp: { gte: getTimeRangeStart(timeRange) },
    //     ...(metricName && { name: metricName }),
    //   },
    //   _avg: { value: true },
    //   _max: { value: true },
    //   _min: { value: true },
    //   _count: true,
    // });

    // Placeholder response
    const stats = {
      timeRange,
      metricName: metricName || 'all',
      summary: {
        FCP: { avg: 1500, p75: 1800, p95: 2500, count: 1000 },
        LCP: { avg: 2200, p75: 2500, p95: 3500, count: 1000 },
        FID: { avg: 80, p75: 100, p95: 150, count: 800 },
        CLS: { avg: 0.08, p75: 0.1, p95: 0.15, count: 1000 },
        TTFB: { avg: 600, p75: 800, p95: 1200, count: 1000 },
        INP: { avg: 150, p75: 200, p95: 300, count: 900 },
      },
    };

    return NextResponse.json(stats, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error('Error fetching web vitals stats:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
