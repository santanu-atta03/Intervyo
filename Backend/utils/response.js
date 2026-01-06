/**
 * Response Utilities
 * Standardized API response helpers for the Intervyo platform
 * @module utils/response
 */

/**
 * HTTP Status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

/**
 * Standard success response
 * @param {object} res - Express response object
 * @param {object} options - Response options
 * @returns {object} JSON response
 */
export const successResponse = (res, options = {}) => {
  const {
    data = null,
    message = 'Success',
    statusCode = HTTP_STATUS.OK,
    meta = null
  } = options;

  const response = {
    success: true,
    message,
    data
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Standard error response
 * @param {object} res - Express response object
 * @param {object} options - Response options
 * @returns {object} JSON response
 */
export const errorResponse = (res, options = {}) => {
  const {
    message = 'An error occurred',
    statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors = null,
    code = null
  } = options;

  const response = {
    success: false,
    message
  };

  if (errors) {
    response.errors = errors;
  }

  if (code) {
    response.code = code;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && options.stack) {
    response.stack = options.stack;
  }

  return res.status(statusCode).json(response);
};

/**
 * Paginated response
 * @param {object} res - Express response object
 * @param {object} options - Response options
 * @returns {object} JSON response
 */
export const paginatedResponse = (res, options = {}) => {
  const {
    data = [],
    page = 1,
    limit = 10,
    total = 0,
    message = 'Success'
  } = options;

  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      nextPage: hasNextPage ? page + 1 : null,
      prevPage: hasPrevPage ? page - 1 : null
    }
  });
};

/**
 * Created response
 * @param {object} res - Express response object
 * @param {object} data - Created resource data
 * @param {string} message - Success message
 * @returns {object} JSON response
 */
export const createdResponse = (res, data, message = 'Resource created successfully') => {
  return successResponse(res, {
    data,
    message,
    statusCode: HTTP_STATUS.CREATED
  });
};

/**
 * No content response
 * @param {object} res - Express response object
 * @returns {object} Empty response
 */
export const noContentResponse = (res) => {
  return res.status(HTTP_STATUS.NO_CONTENT).send();
};

/**
 * Bad request response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {array} errors - Validation errors
 * @returns {object} JSON response
 */
export const badRequestResponse = (res, message = 'Bad request', errors = null) => {
  return errorResponse(res, {
    message,
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errors,
    code: 'BAD_REQUEST'
  });
};

/**
 * Unauthorized response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @returns {object} JSON response
 */
export const unauthorizedResponse = (res, message = 'Unauthorized access') => {
  return errorResponse(res, {
    message,
    statusCode: HTTP_STATUS.UNAUTHORIZED,
    code: 'UNAUTHORIZED'
  });
};

/**
 * Forbidden response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @returns {object} JSON response
 */
export const forbiddenResponse = (res, message = 'Access forbidden') => {
  return errorResponse(res, {
    message,
    statusCode: HTTP_STATUS.FORBIDDEN,
    code: 'FORBIDDEN'
  });
};

/**
 * Not found response
 * @param {object} res - Express response object
 * @param {string} resource - Resource name
 * @returns {object} JSON response
 */
export const notFoundResponse = (res, resource = 'Resource') => {
  return errorResponse(res, {
    message: `${resource} not found`,
    statusCode: HTTP_STATUS.NOT_FOUND,
    code: 'NOT_FOUND'
  });
};

/**
 * Conflict response (for duplicate entries)
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @returns {object} JSON response
 */
export const conflictResponse = (res, message = 'Resource already exists') => {
  return errorResponse(res, {
    message,
    statusCode: HTTP_STATUS.CONFLICT,
    code: 'CONFLICT'
  });
};

/**
 * Validation error response
 * @param {object} res - Express response object
 * @param {array} errors - Validation errors
 * @returns {object} JSON response
 */
export const validationErrorResponse = (res, errors) => {
  return errorResponse(res, {
    message: 'Validation failed',
    statusCode: HTTP_STATUS.UNPROCESSABLE_ENTITY,
    errors,
    code: 'VALIDATION_ERROR'
  });
};

/**
 * Too many requests response
 * @param {object} res - Express response object
 * @param {number} retryAfter - Seconds to wait before retrying
 * @returns {object} JSON response
 */
export const tooManyRequestsResponse = (res, retryAfter = 60) => {
  res.setHeader('Retry-After', retryAfter);
  return errorResponse(res, {
    message: `Too many requests. Please try again in ${retryAfter} seconds`,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    code: 'RATE_LIMITED'
  });
};

/**
 * Server error response
 * @param {object} res - Express response object
 * @param {Error} error - Error object
 * @returns {object} JSON response
 */
export const serverErrorResponse = (res, error = null) => {
  return errorResponse(res, {
    message: 'Internal server error',
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: 'INTERNAL_ERROR',
    stack: error?.stack
  });
};

/**
 * Service unavailable response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @returns {object} JSON response
 */
export const serviceUnavailableResponse = (res, message = 'Service temporarily unavailable') => {
  return errorResponse(res, {
    message,
    statusCode: HTTP_STATUS.SERVICE_UNAVAILABLE,
    code: 'SERVICE_UNAVAILABLE'
  });
};

/**
 * API versioning response wrapper
 * @param {object} res - Express response object
 * @param {object} options - Response options
 * @returns {object} JSON response
 */
export const versionedResponse = (res, options = {}) => {
  const { version = '1.0', ...rest } = options;
  
  return successResponse(res, {
    ...rest,
    meta: {
      ...rest.meta,
      apiVersion: version,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Stream response helper (for large data)
 * @param {object} res - Express response object
 * @param {AsyncIterable} dataStream - Async iterable data source
 * @param {string} contentType - Content type
 */
export const streamResponse = async (res, dataStream, contentType = 'application/json') => {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    for await (const chunk of dataStream) {
      res.write(typeof chunk === 'string' ? chunk : JSON.stringify(chunk));
    }
    res.end();
  } catch (error) {
    if (!res.headersSent) {
      serverErrorResponse(res, error);
    } else {
      res.end();
    }
  }
};

/**
 * Download file response
 * @param {object} res - Express response object
 * @param {Buffer|string} data - File data
 * @param {string} filename - File name
 * @param {string} contentType - Content type
 */
export const downloadResponse = (res, data, filename, contentType = 'application/octet-stream') => {
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(data);
};

/**
 * JSON download response
 * @param {object} res - Express response object
 * @param {object} data - Data to download as JSON
 * @param {string} filename - File name
 */
export const jsonDownloadResponse = (res, data, filename = 'data.json') => {
  const jsonString = JSON.stringify(data, null, 2);
  downloadResponse(res, jsonString, filename, 'application/json');
};

/**
 * CSV download response
 * @param {object} res - Express response object
 * @param {array} data - Array of objects to convert to CSV
 * @param {string} filename - File name
 */
export const csvDownloadResponse = (res, data, filename = 'data.csv') => {
  if (!Array.isArray(data) || data.length === 0) {
    return badRequestResponse(res, 'No data to export');
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert to CSV
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const escaped = String(value ?? '').replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    )
  ];

  downloadResponse(res, csvRows.join('\n'), filename, 'text/csv');
};

/**
 * Response time tracking middleware
 * @returns {Function} Express middleware
 */
export const responseTimeMiddleware = () => {
  return (req, res, next) => {
    const startTime = process.hrtime.bigint();

    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1_000_000;
      res.setHeader('X-Response-Time', `${durationMs.toFixed(2)}ms`);
    });

    next();
  };
};

/**
 * Async handler wrapper to catch errors
 * @param {Function} fn - Async route handler
 * @returns {Function} Wrapped handler
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Cache control helper
 * @param {object} res - Express response object
 * @param {object} options - Cache options
 */
export const setCacheHeaders = (res, options = {}) => {
  const {
    maxAge = 0,
    sMaxAge = null,
    isPrivate = false,
    noCache = false,
    noStore = false,
    mustRevalidate = false
  } = options;

  const directives = [];

  if (noStore) {
    directives.push('no-store');
  } else if (noCache) {
    directives.push('no-cache');
  } else {
    directives.push(isPrivate ? 'private' : 'public');
    directives.push(`max-age=${maxAge}`);
    
    if (sMaxAge !== null) {
      directives.push(`s-maxage=${sMaxAge}`);
    }
  }

  if (mustRevalidate) {
    directives.push('must-revalidate');
  }

  res.setHeader('Cache-Control', directives.join(', '));
};

export default {
  HTTP_STATUS,
  successResponse,
  errorResponse,
  paginatedResponse,
  createdResponse,
  noContentResponse,
  badRequestResponse,
  unauthorizedResponse,
  forbiddenResponse,
  notFoundResponse,
  conflictResponse,
  validationErrorResponse,
  tooManyRequestsResponse,
  serverErrorResponse,
  serviceUnavailableResponse,
  versionedResponse,
  streamResponse,
  downloadResponse,
  jsonDownloadResponse,
  csvDownloadResponse,
  responseTimeMiddleware,
  asyncHandler,
  setCacheHeaders
};
