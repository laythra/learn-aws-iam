import { describe, expect, it } from 'vitest';

import { BASE_REGULAR_NODE_METRICS, getRegularNodeMetrics } from '@/domain/node-metrics';

describe('getRegularNodeMetrics', () => {
  it('returns sm metrics for small viewports', () => {
    const metrics = getRegularNodeMetrics(1024, 680);

    expect(metrics.breakpointId).toBe('sm');
    expect(metrics.nodeWidth).toBeLessThan(BASE_REGULAR_NODE_METRICS.nodeWidth);
    expect(metrics.nodeHeight).toBeLessThan(BASE_REGULAR_NODE_METRICS.nodeHeight);
  });

  it('returns lg metrics for common laptop viewport', () => {
    const metrics = getRegularNodeMetrics(1512, 982);

    expect(metrics.breakpointId).toBe('lg');
    expect(metrics.nodeWidth).toBe(BASE_REGULAR_NODE_METRICS.nodeWidth);
    expect(metrics.nodeHeight).toBe(BASE_REGULAR_NODE_METRICS.nodeHeight);
  });

  it('maintains spacing invariants', () => {
    const metrics = getRegularNodeMetrics(1920, 1080);

    expect(metrics.horizontalSpacing).toBeGreaterThan(metrics.nodeWidth);
    expect(metrics.verticalSpacing).toBeGreaterThan(metrics.nodeHeight);
    expect(metrics.offsetScale).toBeGreaterThanOrEqual(1);
  });
});
