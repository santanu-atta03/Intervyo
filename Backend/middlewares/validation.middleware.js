/**
 * Input Validation Middleware
 * Comprehensive validation utilities for the Intervyo platform
 * @module middlewares/validation.middleware
 */

/**
 * Custom validation error class
 */
class ValidationError extends Error {
  constructor(message, field = null, details = null) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.details = details;
    this.statusCode = 400;
  }
}

/**
 * Validation utility functions
 */
const validators = {
  /**
   * Check if value is a valid email
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  isEmail: (email) => {
    if (typeof email !== "string") return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.toLowerCase().trim());
  },

  /**
   * Check if value is a strong password
   * @param {string} password - Password to validate
   * @returns {object} Validation result with details
   */
  isStrongPassword: (password) => {
    if (typeof password !== "string") {
      return { valid: false, errors: ["Password must be a string"] };
    }

    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (password.length > 128) {
      errors.push("Password cannot exceed 128 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      valid: errors.length === 0,
      errors,
      strength:
        errors.length === 0 ? "strong" : errors.length <= 2 ? "medium" : "weak",
    };
  },

  /**
   * Check if value is a valid phone number
   * @param {string} phone - Phone number to validate
   * @returns {boolean}
   */
  isPhone: (phone) => {
    if (typeof phone !== "string") return false;
    // Supports international formats: +1234567890, 123-456-7890, (123) 456-7890
    const phoneRegex =
      /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  },

  /**
   * Check if value is a valid URL
   * @param {string} url - URL to validate
   * @returns {boolean}
   */
  isURL: (url) => {
    if (typeof url !== "string") return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Check if value is a valid MongoDB ObjectId
   * @param {string} id - ID to validate
   * @returns {boolean}
   */
  isObjectId: (id) => {
    if (typeof id !== "string") return false;
    return /^[a-fA-F0-9]{24}$/.test(id);
  },

  /**
   * Check if string length is within range
   * @param {string} str - String to check
   * @param {number} min - Minimum length
   * @param {number} max - Maximum length
   * @returns {boolean}
   */
  isLengthInRange: (str, min, max) => {
    if (typeof str !== "string") return false;
    const length = str.trim().length;
    return length >= min && length <= max;
  },

  /**
   * Check if value is a valid date
   * @param {string|Date} date - Date to validate
   * @returns {boolean}
   */
  isDate: (date) => {
    if (date instanceof Date) return !isNaN(date);
    const parsed = new Date(date);
    return !isNaN(parsed);
  },

  /**
   * Check if date is in the future
   * @param {string|Date} date - Date to check
   * @returns {boolean}
   */
  isFutureDate: (date) => {
    if (!validators.isDate(date)) return false;
    return new Date(date) > new Date();
  },

  /**
   * Check if value is a valid interview type
   * @param {string} type - Interview type
   * @returns {boolean}
   */
  isValidInterviewType: (type) => {
    const validTypes = [
      "technical",
      "behavioral",
      "hr",
      "coding",
      "system-design",
      "mock",
    ];
    return validTypes.includes(type?.toLowerCase());
  },

  /**
   * Check if value is a valid difficulty level
   * @param {string} level - Difficulty level
   * @returns {boolean}
   */
  isValidDifficulty: (level) => {
    const validLevels = ["easy", "medium", "hard", "expert"];
    return validLevels.includes(level?.toLowerCase());
  },

  /**
   * Check if value is a valid experience level
   * @param {string} level - Experience level
   * @returns {boolean}
   */
  isValidExperienceLevel: (level) => {
    const validLevels = [
      "fresher",
      "junior",
      "mid",
      "senior",
      "lead",
      "principal",
    ];
    return validLevels.includes(level?.toLowerCase());
  },

  /**
   * Check if value is a valid skill
   * @param {string} skill - Skill to validate
   * @returns {boolean}
   */
  isValidSkill: (skill) => {
    if (typeof skill !== "string") return false;
    return skill.trim().length >= 2 && skill.trim().length <= 50;
  },

  /**
   * Check if OTP is valid format
   * @param {string} otp - OTP to validate
   * @returns {boolean}
   */
  isValidOTP: (otp) => {
    if (typeof otp !== "string") return false;
    return /^[0-9]{6}$/.test(otp);
  },
};

/**
 * Sanitization utility functions
 */
const sanitizers = {
  /**
   * Sanitize string to prevent XSS
   * @param {string} str - String to sanitize
   * @returns {string}
   */
  sanitizeString: (str) => {
    if (typeof str !== "string") return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
      .trim();
  },

  /**
   * Sanitize email
   * @param {string} email - Email to sanitize
   * @returns {string}
   */
  sanitizeEmail: (email) => {
    if (typeof email !== "string") return email;
    return email.toLowerCase().trim();
  },

  /**
   * Sanitize phone number
   * @param {string} phone - Phone to sanitize
   * @returns {string}
   */
  sanitizePhone: (phone) => {
    if (typeof phone !== "string") return phone;
    return phone.replace(/[^\d+\-\s()]/g, "").trim();
  },

  /**
   * Remove dangerous HTML tags
   * @param {string} html - HTML string to clean
   * @returns {string}
   */
  stripDangerousTags: (html) => {
    if (typeof html !== "string") return html;
    const dangerousTags =
      /<\s*(script|style|iframe|object|embed|link|meta|form|input)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>|<\s*(script|style|iframe|object|embed|link|meta|form|input)[^>]*\/?>/gi;
    return html.replace(dangerousTags, "");
  },

  /**
   * Sanitize MongoDB query to prevent injection
   * @param {object} query - Query object to sanitize
   * @returns {object}
   */
  sanitizeMongoQuery: (query) => {
    if (typeof query !== "object" || query === null) return query;

    const dangerous = ["$where", "$regex", "$ne", "$nin", "$or", "$and"];
    const sanitized = {};

    for (const [key, value] of Object.entries(query)) {
      if (key.startsWith("$") && dangerous.includes(key)) {
        continue; // Skip dangerous operators
      }
      if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
      ) {
        sanitized[key] = sanitizers.sanitizeMongoQuery(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  },

  /**
   * Normalize name (capitalize first letter of each word)
   * @param {string} name - Name to normalize
   * @returns {string}
   */
  normalizeName: (name) => {
    if (typeof name !== "string") return name;
    return name
      .trim()
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  },
};

/**
 * Validation middleware factory
 * @param {object} schema - Validation schema
 * @returns {Function} Express middleware
 */
const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      // Check required
      if (
        rules.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors.push({ field, message: `${field} is required` });
        continue;
      }

      // Skip validation if field is not provided and not required
      if (value === undefined || value === null) continue;

      // Type validation
      if (rules.type) {
        const type = Array.isArray(value) ? "array" : typeof value;
        if (type !== rules.type) {
          errors.push({
            field,
            message: `${field} must be of type ${rules.type}`,
          });
          continue;
        }
      }

      // String validations
      if (typeof value === "string") {
        if (rules.minLength && value.trim().length < rules.minLength) {
          errors.push({
            field,
            message: `${field} must be at least ${rules.minLength} characters`,
          });
        }
        if (rules.maxLength && value.trim().length > rules.maxLength) {
          errors.push({
            field,
            message: `${field} cannot exceed ${rules.maxLength} characters`,
          });
        }
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push({
            field,
            message: rules.patternMessage || `${field} format is invalid`,
          });
        }
        if (rules.isEmail && !validators.isEmail(value)) {
          errors.push({
            field,
            message: `${field} must be a valid email address`,
          });
        }
        if (rules.isURL && !validators.isURL(value)) {
          errors.push({ field, message: `${field} must be a valid URL` });
        }
        if (rules.isPhone && !validators.isPhone(value)) {
          errors.push({
            field,
            message: `${field} must be a valid phone number`,
          });
        }
        if (rules.isObjectId && !validators.isObjectId(value)) {
          errors.push({ field, message: `${field} must be a valid ID` });
        }

        // Sanitize string
        if (rules.sanitize !== false) {
          req.body[field] = sanitizers.sanitizeString(value);
        }
      }

      // Number validations
      if (typeof value === "number") {
        if (rules.min !== undefined && value < rules.min) {
          errors.push({
            field,
            message: `${field} must be at least ${rules.min}`,
          });
        }
        if (rules.max !== undefined && value > rules.max) {
          errors.push({
            field,
            message: `${field} cannot exceed ${rules.max}`,
          });
        }
      }

      // Array validations
      if (Array.isArray(value)) {
        if (rules.minItems && value.length < rules.minItems) {
          errors.push({
            field,
            message: `${field} must have at least ${rules.minItems} items`,
          });
        }
        if (rules.maxItems && value.length > rules.maxItems) {
          errors.push({
            field,
            message: `${field} cannot have more than ${rules.maxItems} items`,
          });
        }
        if (rules.enum && !value.every((item) => rules.enum.includes(item))) {
          errors.push({ field, message: `${field} contains invalid values` });
        }
      }

      // Enum validation
      if (rules.enum && !Array.isArray(value) && !rules.enum.includes(value)) {
        errors.push({
          field,
          message: `${field} must be one of: ${rules.enum.join(", ")}`,
        });
      }

      // Custom validator
      if (rules.custom && typeof rules.custom === "function") {
        const customResult = rules.custom(value, req.body);
        if (customResult !== true) {
          errors.push({
            field,
            message: customResult || `${field} validation failed`,
          });
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

/**
 * Pre-defined validation schemas
 */
const schemas = {
  // User registration schema
  userRegistration: {
    name: {
      required: true,
      type: "string",
      minLength: 2,
      maxLength: 100,
    },
    email: {
      required: true,
      type: "string",
      isEmail: true,
    },
    password: {
      required: true,
      type: "string",
      minLength: 8,
      maxLength: 128,
      custom: (value) => {
        const result = validators.isStrongPassword(value);
        return result.valid ? true : result.errors[0];
      },
    },
  },

  // User login schema
  userLogin: {
    email: {
      required: true,
      type: "string",
      isEmail: true,
    },
    password: {
      required: true,
      type: "string",
    },
  },

  // OTP verification schema
  otpVerification: {
    email: {
      required: true,
      type: "string",
      isEmail: true,
    },
    otp: {
      required: true,
      type: "string",
      custom: (value) => {
        return validators.isValidOTP(value) ? true : "OTP must be 6 digits";
      },
    },
  },

  // Profile update schema
  profileUpdate: {
    name: {
      type: "string",
      minLength: 2,
      maxLength: 100,
    },
    phone: {
      type: "string",
      isPhone: true,
    },
    bio: {
      type: "string",
      maxLength: 500,
    },
    skills: {
      type: "array",
      maxItems: 20,
      custom: (value) => {
        if (!Array.isArray(value)) return true;
        return value.every((s) => validators.isValidSkill(s))
          ? true
          : "Invalid skill format";
      },
    },
    experienceLevel: {
      type: "string",
      custom: (value) => {
        return validators.isValidExperienceLevel(value)
          ? true
          : "Invalid experience level";
      },
    },
    linkedIn: {
      type: "string",
      isURL: true,
    },
    github: {
      type: "string",
      isURL: true,
    },
    portfolio: {
      type: "string",
      isURL: true,
    },
  },

  // Interview creation schema
  interviewCreate: {
    type: {
      required: true,
      type: "string",
      custom: (value) => {
        return validators.isValidInterviewType(value)
          ? true
          : "Invalid interview type";
      },
    },
    difficulty: {
      required: true,
      type: "string",
      custom: (value) => {
        return validators.isValidDifficulty(value)
          ? true
          : "Invalid difficulty level";
      },
    },
    duration: {
      required: true,
      type: "number",
      min: 15,
      max: 180,
    },
    topics: {
      type: "array",
      minItems: 1,
      maxItems: 10,
    },
    scheduledAt: {
      type: "string",
      custom: (value) => {
        if (!value) return true;
        return validators.isFutureDate(value)
          ? true
          : "Interview must be scheduled for a future date";
      },
    },
  },

  // Blog post schema
  blogPost: {
    title: {
      required: true,
      type: "string",
      minLength: 5,
      maxLength: 200,
    },
    content: {
      required: true,
      type: "string",
      minLength: 50,
      maxLength: 50000,
    },
    summary: {
      type: "string",
      maxLength: 500,
    },
    tags: {
      type: "array",
      maxItems: 10,
    },
    category: {
      type: "string",
      enum: [
        "interview-tips",
        "career-advice",
        "technical",
        "industry-news",
        "success-stories",
      ],
    },
  },

  // Feedback schema
  feedback: {
    rating: {
      required: true,
      type: "number",
      min: 1,
      max: 5,
    },
    comment: {
      type: "string",
      maxLength: 1000,
    },
    interviewId: {
      required: true,
      type: "string",
      isObjectId: true,
    },
  },
};

/**
 * Middleware to validate request params
 * @param {string} paramName - Parameter name
 * @param {string} validationType - Type of validation
 * @returns {Function} Express middleware
 */
const validateParam = (paramName, validationType = "objectId") => {
  return (req, res, next) => {
    const value = req.params[paramName];

    if (!value) {
      return res.status(400).json({
        success: false,
        message: `${paramName} parameter is required`,
      });
    }

    let isValid = false;
    switch (validationType) {
      case "objectId":
        isValid = validators.isObjectId(value);
        break;
      case "email":
        isValid = validators.isEmail(value);
        break;
      case "uuid":
        isValid =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            value,
          );
        break;
      default:
        isValid = true;
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
      });
    }

    next();
  };
};

/**
 * Middleware to validate query parameters
 * @param {object} allowedParams - Object defining allowed query parameters
 * @returns {Function} Express middleware
 */
const validateQuery = (allowedParams) => {
  return (req, res, next) => {
    const errors = [];

    for (const [param, rules] of Object.entries(allowedParams)) {
      const value = req.query[param];

      if (rules.required && !value) {
        errors.push({ param, message: `${param} query parameter is required` });
        continue;
      }

      if (value !== undefined) {
        if (rules.type === "number") {
          const num = Number(value);
          if (isNaN(num)) {
            errors.push({ param, message: `${param} must be a number` });
          } else {
            req.query[param] = num;
            if (rules.min !== undefined && num < rules.min) {
              errors.push({
                param,
                message: `${param} must be at least ${rules.min}`,
              });
            }
            if (rules.max !== undefined && num > rules.max) {
              errors.push({
                param,
                message: `${param} cannot exceed ${rules.max}`,
              });
            }
          }
        }

        if (rules.enum && !rules.enum.includes(value)) {
          errors.push({
            param,
            message: `${param} must be one of: ${rules.enum.join(", ")}`,
          });
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors,
      });
    }

    next();
  };
};

export {
  ValidationError,
  validators,
  sanitizers,
  validate,
  schemas,
  validateParam,
  validateQuery,
};

export default validate;
