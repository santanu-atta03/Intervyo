/**
 * Logger Utility
 * Centralized logging system for the Intervyo platform
 * @module utils/logger
 */

/**
 * Log levels enumeration
 */
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

/**
 * ANSI color codes for console output
 */
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

/**
 * Get current log level from environment
 * @returns {number} Log level
 */
const getCurrentLogLevel = () => {
  const level = process.env.LOG_LEVEL?.toUpperCase() || 'INFO';
  return LOG_LEVELS[level] ?? LOG_LEVELS.INFO;
};

/**
 * Format timestamp for log output
 * @returns {string} Formatted timestamp
 */
const formatTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

/**
 * Format log message with metadata
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} meta - Additional metadata
 * @returns {string} Formatted log string
 */
const formatLogMessage = (level, message, meta = {}) => {
  const timestamp = formatTimestamp();
  const metaString = Object.keys(meta).length > 0 
    ? ` ${JSON.stringify(meta)}` 
    : '';
  
  return `[${timestamp}] [${level}] ${message}${metaString}`;
};

/**
 * Format log message with colors for console
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {object} meta - Additional metadata
 * @returns {string} Formatted log string with colors
 */
const formatColoredLogMessage = (level, message, meta = {}) => {
  const timestamp = formatTimestamp();
  const levelColors = {
    ERROR: COLORS.red,
    WARN: COLORS.yellow,
    INFO: COLORS.green,
    DEBUG: COLORS.blue,
    TRACE: COLORS.gray
  };
  
  const color = levelColors[level] || COLORS.white;
  const metaString = Object.keys(meta).length > 0 
    ? `\n${COLORS.gray}${JSON.stringify(meta, null, 2)}${COLORS.reset}` 
    : '';
  
  return `${COLORS.dim}[${timestamp}]${COLORS.reset} ${color}[${level}]${COLORS.reset} ${message}${metaString}`;
};

/**
 * Logger class providing structured logging capabilities
 */
class Logger {
  constructor(options = {}) {
    this.context = options.context || 'App';
    this.useColors = options.useColors !== false && process.env.NODE_ENV !== 'production';
    this.logLevel = getCurrentLogLevel();
    this.transports = options.transports || ['console'];
    this.logHistory = [];
    this.maxHistorySize = options.maxHistorySize || 1000;
  }

  /**
   * Check if a log level should be logged
   * @param {number} level - Level to check
   * @returns {boolean}
   */
  shouldLog(level) {
    return level <= this.logLevel;
  }

  /**
   * Add log entry to history
   * @param {object} entry - Log entry
   */
  addToHistory(entry) {
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }
  }

  /**
   * Core log method
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {object} meta - Additional metadata
   */
  log(level, message, meta = {}) {
    const levelNum = LOG_LEVELS[level];
    if (!this.shouldLog(levelNum)) return;

    const logEntry = {
      timestamp: new Date(),
      level,
      context: this.context,
      message,
      meta
    };

    this.addToHistory(logEntry);

    if (this.transports.includes('console')) {
      const formattedMessage = this.useColors
        ? formatColoredLogMessage(level, `[${this.context}] ${message}`, meta)
        : formatLogMessage(level, `[${this.context}] ${message}`, meta);
      
      switch (level) {
        case 'ERROR':
          console.error(formattedMessage);
          break;
        case 'WARN':
          console.warn(formattedMessage);
          break;
        default:
          console.log(formattedMessage);
      }
    }
  }

  /**
   * Log error message
   * @param {string} message - Error message
   * @param {object|Error} meta - Metadata or Error object
   */
  error(message, meta = {}) {
    if (meta instanceof Error) {
      meta = {
        errorMessage: meta.message,
        errorStack: meta.stack,
        errorName: meta.name
      };
    }
    this.log('ERROR', message, meta);
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {object} meta - Additional metadata
   */
  warn(message, meta = {}) {
    this.log('WARN', message, meta);
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {object} meta - Additional metadata
   */
  info(message, meta = {}) {
    this.log('INFO', message, meta);
  }

  /**
   * Log debug message
   * @param {string} message - Debug message
   * @param {object} meta - Additional metadata
   */
  debug(message, meta = {}) {
    this.log('DEBUG', message, meta);
  }

  /**
   * Log trace message
   * @param {string} message - Trace message
   * @param {object} meta - Additional metadata
   */
  trace(message, meta = {}) {
    this.log('TRACE', message, meta);
  }

  /**
   * Create a child logger with additional context
   * @param {string} childContext - Child context name
   * @returns {Logger} Child logger instance
   */
  child(childContext) {
    return new Logger({
      context: `${this.context}:${childContext}`,
      useColors: this.useColors,
      transports: this.transports,
      maxHistorySize: this.maxHistorySize
    });
  }

  /**
   * Log HTTP request details
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {number} duration - Request duration in ms
   */
  logRequest(req, res, duration) {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    if (req.user?.id) {
      meta.userId = req.user.id;
    }

    const level = res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO';
    this.log(level, `${req.method} ${req.originalUrl} - ${res.statusCode}`, meta);
  }

  /**
   * Log database operation
   * @param {string} operation - Operation type (find, insert, update, delete)
   * @param {string} collection - Collection name
   * @param {object} details - Operation details
   */
  logDB(operation, collection, details = {}) {
    this.debug(`DB ${operation.toUpperCase()} on ${collection}`, details);
  }

  /**
   * Get recent logs from history
   * @param {number} count - Number of logs to retrieve
   * @param {string} level - Filter by level
   * @returns {array} Log entries
   */
  getRecentLogs(count = 100, level = null) {
    let logs = this.logHistory;
    
    if (level) {
      logs = logs.filter(log => log.level === level.toUpperCase());
    }
    
    return logs.slice(-count);
  }

  /**
   * Clear log history
   */
  clearHistory() {
    this.logHistory = [];
  }
}

/**
 * Express middleware for request logging
 * @param {Logger} logger - Logger instance
 * @returns {Function} Express middleware
 */
const requestLogger = (logger) => {
  return (req, res, next) => {
    const startTime = Date.now();

    // Log when response finishes
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.logRequest(req, res, duration);
    });

    next();
  };
};

/**
 * Express middleware for error logging
 * @param {Logger} logger - Logger instance
 * @returns {Function} Express error middleware
 */
const errorLogger = (logger) => {
  return (err, req, res, next) => {
    logger.error('Unhandled error', {
      error: err.message,
      stack: err.stack,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userId: req.user?.id
    });
    next(err);
  };
};

/**
 * Performance monitoring utility
 */
class PerformanceMonitor {
  constructor(logger) {
    this.logger = logger;
    this.timers = new Map();
    this.metrics = new Map();
  }

  /**
   * Start a timer
   * @param {string} name - Timer name
   */
  startTimer(name) {
    this.timers.set(name, {
      start: process.hrtime.bigint(),
      startDate: new Date()
    });
  }

  /**
   * End a timer and log the duration
   * @param {string} name - Timer name
   * @param {object} meta - Additional metadata
   * @returns {number} Duration in milliseconds
   */
  endTimer(name, meta = {}) {
    const timer = this.timers.get(name);
    if (!timer) {
      this.logger.warn(`Timer '${name}' not found`);
      return 0;
    }

    const end = process.hrtime.bigint();
    const durationNs = Number(end - timer.start);
    const durationMs = durationNs / 1_000_000;

    this.timers.delete(name);

    // Update metrics
    const metric = this.metrics.get(name) || { count: 0, totalMs: 0, min: Infinity, max: 0 };
    metric.count++;
    metric.totalMs += durationMs;
    metric.min = Math.min(metric.min, durationMs);
    metric.max = Math.max(metric.max, durationMs);
    metric.avg = metric.totalMs / metric.count;
    this.metrics.set(name, metric);

    this.logger.debug(`Timer '${name}' completed`, {
      duration: `${durationMs.toFixed(2)}ms`,
      ...meta
    });

    return durationMs;
  }

  /**
   * Get metrics for a specific timer
   * @param {string} name - Timer name
   * @returns {object} Metrics
   */
  getMetrics(name) {
    return this.metrics.get(name);
  }

  /**
   * Get all metrics
   * @returns {object} All metrics
   */
  getAllMetrics() {
    const result = {};
    for (const [name, metric] of this.metrics) {
      result[name] = {
        ...metric,
        avg: metric.avg.toFixed(2) + 'ms',
        min: metric.min.toFixed(2) + 'ms',
        max: metric.max.toFixed(2) + 'ms'
      };
    }
    return result;
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.timers.clear();
    this.metrics.clear();
  }
}

// Create default logger instance
const defaultLogger = new Logger({ context: 'Intervyo' });

// Create child loggers for different modules
const dbLogger = defaultLogger.child('Database');
const authLogger = defaultLogger.child('Auth');
const aiLogger = defaultLogger.child('AI');
const socketLogger = defaultLogger.child('Socket');
const apiLogger = defaultLogger.child('API');

// Create performance monitor
const performanceMonitor = new PerformanceMonitor(defaultLogger);

export {
  Logger,
  LOG_LEVELS,
  formatTimestamp,
  formatLogMessage,
  requestLogger,
  errorLogger,
  PerformanceMonitor,
  performanceMonitor,
  defaultLogger,
  dbLogger,
  authLogger,
  aiLogger,
  socketLogger,
  apiLogger
};

export default defaultLogger;
