/**
 * Performance Monitoring Utility
 * Track and log performance metrics for API endpoints
 * @module utils/performance.monitor
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.slowThreshold = parseInt(process.env.SLOW_REQUEST_THRESHOLD) || 1000; // 1 second
  }

  /**
   * Middleware to track request performance
   */
  trackRequest() {
    return (req, res, next) => {
      const startTime = Date.now();
      const startMemory = process.memoryUsage();

      // Capture original end method
      const originalEnd = res.end;

      // Override end method to capture metrics
      res.end = (...args) => {
        const duration = Date.now() - startTime;
        const endMemory = process.memoryUsage();
        const memoryDelta = {
          heapUsed: endMemory.heapUsed - startMemory.heapUsed,
          external: endMemory.external - startMemory.external
        };

        // Log metrics
        this.logMetric({
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          duration,
          memoryDelta,
          timestamp: new Date().toISOString(),
          userId: req.user?.id || 'anonymous',
          ip: req.ip || req.connection.remoteAddress
        });

        // Warn if request is slow
        if (duration > this.slowThreshold) {
          console.warn('⚠️  Slow Request Detected:', {
            method: req.method,
            path: req.path,
            duration: `${duration}ms`,
            threshold: `${this.slowThreshold}ms`
          });
        }

        // Call original end
        originalEnd.apply(res, args);
      };

      next();
    };
  }

  /**
   * Log metric to storage
   */
  logMetric(metric) {
    const key = `${metric.method}:${metric.path}`;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        count: 0,
        totalDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        avgDuration: 0,
        errors: 0,
        path: metric.path,
        method: metric.method
      });
    }

    const stats = this.metrics.get(key);
    stats.count++;
    stats.totalDuration += metric.duration;
    stats.minDuration = Math.min(stats.minDuration, metric.duration);
    stats.maxDuration = Math.max(stats.maxDuration, metric.duration);
    stats.avgDuration = Math.round(stats.totalDuration / stats.count);

    if (metric.statusCode >= 400) {
      stats.errors++;
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Request Metric:', {
        method: metric.method,
        path: metric.path,
        duration: `${metric.duration}ms`,
        status: metric.statusCode,
        memory: `${Math.round(metric.memoryDelta.heapUsed / 1024)}KB`
      });
    }
  }

  /**
   * Get performance statistics
   */
  getStats() {
    const stats = Array.from(this.metrics.values())
      .sort((a, b) => b.avgDuration - a.avgDuration);

    return {
      endpoints: stats,
      summary: {
        totalRequests: stats.reduce((sum, s) => sum + s.count, 0),
        totalErrors: stats.reduce((sum, s) => sum + s.errors, 0),
        avgResponseTime: Math.round(
          stats.reduce((sum, s) => sum + s.avgDuration, 0) / stats.length
        ),
        slowestEndpoint: stats[0] || null
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Reset metrics
   */
  reset() {
    this.metrics.clear();
  }

  /**
   * Get top slow endpoints
   */
  getSlowEndpoints(limit = 10) {
    return Array.from(this.metrics.values())
      .sort((a, b) => b.avgDuration - a.avgDuration)
      .slice(0, limit)
      .map(stat => ({
        endpoint: `${stat.method} ${stat.path}`,
        avgDuration: `${stat.avgDuration}ms`,
        maxDuration: `${stat.maxDuration}ms`,
        requestCount: stat.count,
        errorRate: `${Math.round((stat.errors / stat.count) * 100)}%`
      }));
  }

  /**
   * Get error-prone endpoints
   */
  getErrorProneEndpoints(limit = 10) {
    return Array.from(this.metrics.values())
      .filter(stat => stat.errors > 0)
      .sort((a, b) => (b.errors / b.count) - (a.errors / a.count))
      .slice(0, limit)
      .map(stat => ({
        endpoint: `${stat.method} ${stat.path}`,
        totalRequests: stat.count,
        errors: stat.errors,
        errorRate: `${Math.round((stat.errors / stat.count) * 100)}%`
      }));
  }

  /**
   * Print performance summary
   */
  printSummary() {
    const stats = this.getStats();
    
    console.log('\n📊 Performance Summary\n');
    console.log('═'.repeat(60));
    console.log(`Total Requests: ${stats.summary.totalRequests}`);
    console.log(`Total Errors: ${stats.summary.totalErrors}`);
    console.log(`Avg Response Time: ${stats.summary.avgResponseTime}ms`);
    console.log(`Uptime: ${Math.round(stats.uptime / 60)} minutes`);
    
    if (stats.summary.slowestEndpoint) {
      console.log(`\nSlowest Endpoint: ${stats.summary.slowestEndpoint.method} ${stats.summary.slowestEndpoint.path}`);
      console.log(`  Avg: ${stats.summary.slowestEndpoint.avgDuration}ms`);
      console.log(`  Max: ${stats.summary.slowestEndpoint.maxDuration}ms`);
    }

    const slowEndpoints = this.getSlowEndpoints(5);
    if (slowEndpoints.length > 0) {
      console.log('\n⚠️  Top 5 Slow Endpoints:');
      slowEndpoints.forEach((ep, i) => {
        console.log(`  ${i + 1}. ${ep.endpoint} (avg: ${ep.avgDuration})`);
      });
    }

    const errorEndpoints = this.getErrorProneEndpoints(5);
    if (errorEndpoints.length > 0) {
      console.log('\n❌ Top 5 Error-Prone Endpoints:');
      errorEndpoints.forEach((ep, i) => {
        console.log(`  ${i + 1}. ${ep.endpoint} (${ep.errorRate} error rate)`);
      });
    }

    console.log('\n' + '═'.repeat(60) + '\n');
  }
}

// Singleton instance
const performanceMonitor = new PerformanceMonitor();

// Print summary every 30 minutes in production
if (process.env.NODE_ENV === 'production') {
  setInterval(() => {
    performanceMonitor.printSummary();
  }, 30 * 60 * 1000);
}

export default performanceMonitor;
export { PerformanceMonitor };
