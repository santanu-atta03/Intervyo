/**
 * Environment Variable Validation
 * Validates required environment variables on application startup
 * @module config/env.validation
 */

const requiredEnvVars = {
  // Core required variables
  MONGODB_URI: {
    required: true,
    description: 'MongoDB connection string',
    validate: (value) => value.startsWith('mongodb://') || value.startsWith('mongodb+srv://'),
    errorMessage: 'MONGODB_URI must be a valid MongoDB connection string'
  },
  JWT_SECRET: {
    required: true,
    description: 'Secret key for JWT token generation',
    validate: (value) => value.length >= 32,
    errorMessage: 'JWT_SECRET must be at least 32 characters long for security'
  },
  PORT: {
    required: false,
    description: 'Server port number',
    default: '5000',
    validate: (value) => !isNaN(value) && parseInt(value) > 0 && parseInt(value) < 65536,
    errorMessage: 'PORT must be a valid port number (1-65535)'
  },
  NODE_ENV: {
    required: false,
    description: 'Application environment',
    default: 'development',
    validate: (value) => ['development', 'production', 'test'].includes(value),
    errorMessage: 'NODE_ENV must be one of: development, production, test'
  },
  
  // Frontend URLs
  CLIENT_URL: {
    required: false,
    description: 'Frontend client URL',
    default: 'http://localhost:5173',
    validate: (value) => value.startsWith('http://') || value.startsWith('https://'),
    errorMessage: 'CLIENT_URL must be a valid URL'
  },
  FRONTEND_URL: {
    required: false,
    description: 'Frontend URL (alternative)',
    default: 'http://localhost:5173',
    validate: (value) => value.startsWith('http://') || value.startsWith('https://'),
    errorMessage: 'FRONTEND_URL must be a valid URL'
  },

  // Optional AI Services
  GROQ_API_KEY: {
    required: false,
    description: 'Groq AI API key for interview generation',
    sensitive: true
  },
  OPENAI_API_KEY: {
    required: false,
    description: 'OpenAI API key',
    sensitive: true
  },
  HUGGINGFACE_API_KEY: {
    required: false,
    description: 'HuggingFace API key',
    sensitive: true
  },

  // Optional OAuth
  GOOGLE_CLIENT_ID: {
    required: false,
    description: 'Google OAuth client ID',
    sensitive: false
  },
  GOOGLE_CLIENT_SECRET: {
    required: false,
    description: 'Google OAuth client secret',
    sensitive: true
  },
  GITHUB_CLIENT_ID: {
    required: false,
    description: 'GitHub OAuth client ID',
    sensitive: false
  },
  GITHUB_CLIENT_SECRET: {
    required: false,
    description: 'GitHub OAuth client secret',
    sensitive: true
  },

  // Optional Email
  EMAIL_USER: {
    required: false,
    description: 'Email service username',
    sensitive: false
  },
  EMAIL_PASS: {
    required: false,
    description: 'Email service password',
    sensitive: true
  },
  EMAIL_FROM: {
    required: false,
    description: 'Email from address',
    default: 'noreply@intervyo.xyz'
  },

  // Optional Cloudinary
  CLOUDINARY_CLOUD_NAME: {
    required: false,
    description: 'Cloudinary cloud name for file uploads',
    sensitive: false
  },
  CLOUDINARY_API_KEY: {
    required: false,
    description: 'Cloudinary API key',
    sensitive: true
  },
  CLOUDINARY_API_SECRET: {
    required: false,
    description: 'Cloudinary API secret',
    sensitive: true
  },

  // Optional Rate Limiting
  RATE_LIMIT_WINDOW_MS: {
    required: false,
    description: 'Rate limit window in milliseconds',
    default: '900000',
    validate: (value) => !isNaN(value) && parseInt(value) > 0,
    errorMessage: 'RATE_LIMIT_WINDOW_MS must be a positive number'
  },
  RATE_LIMIT_MAX_REQUESTS: {
    required: false,
    description: 'Maximum requests per window',
    default: '100',
    validate: (value) => !isNaN(value) && parseInt(value) > 0,
    errorMessage: 'RATE_LIMIT_MAX_REQUESTS must be a positive number'
  }
};

/**
 * Validate all environment variables
 * @returns {Object} Validation result with errors and warnings
 */
export function validateEnv() {
  const errors = [];
  const warnings = [];
  const missing = [];
  const configured = [];

  // Check each environment variable
  for (const [key, config] of Object.entries(requiredEnvVars)) {
    const value = process.env[key];

    // Check if required variable is missing
    if (config.required && !value) {
      errors.push({
        variable: key,
        message: `${key} is required but not set`,
        description: config.description
      });
      missing.push(key);
      continue;
    }

    // Set default value if not provided
    if (!value && config.default) {
      process.env[key] = config.default;
      warnings.push({
        variable: key,
        message: `${key} not set, using default: ${config.default}`,
        description: config.description
      });
      continue;
    }

    // Skip validation if optional and not set
    if (!value && !config.required) {
      missing.push(key);
      continue;
    }

    // Validate value if validator is provided
    if (value && config.validate) {
      try {
        if (!config.validate(value)) {
          errors.push({
            variable: key,
            message: config.errorMessage || `${key} has invalid value`,
            description: config.description
          });
        } else {
          configured.push(key);
        }
      } catch (error) {
        errors.push({
          variable: key,
          message: `${key} validation failed: ${error.message}`,
          description: config.description
        });
      }
    } else if (value) {
      configured.push(key);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missing,
    configured,
    summary: {
      total: Object.keys(requiredEnvVars).length,
      configured: configured.length,
      missing: missing.length,
      errors: errors.length,
      warnings: warnings.length
    }
  };
}

/**
 * Print validation results to console
 * @param {Object} result - Validation result
 */
export function printValidationResults(result) {
  console.log('\n🔍 Environment Variable Validation\n');
  console.log('═'.repeat(50));

  // Print summary
  console.log('\n📊 Summary:');
  console.log(`   Total variables: ${result.summary.total}`);
  console.log(`   ✅ Configured: ${result.summary.configured}`);
  console.log(`   ⚠️  Missing (optional): ${result.summary.missing}`);
  console.log(`   ❌ Errors: ${result.summary.errors}`);
  console.log(`   ⚡ Warnings: ${result.summary.warnings}`);

  // Print errors
  if (result.errors.length > 0) {
    console.log('\n❌ ERRORS (Must be fixed):');
    result.errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.variable}`);
      console.log(`      ${error.message}`);
      console.log(`      Description: ${error.description}`);
    });
  }

  // Print warnings
  if (result.warnings.length > 0) {
    console.log('\n⚡ WARNINGS:');
    result.warnings.forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning.message}`);
    });
  }

  // Print configured services
  if (result.configured.length > 0) {
    console.log('\n✅ Configured Services:');
    const serviceGroups = {
      Core: ['MONGODB_URI', 'JWT_SECRET', 'PORT', 'NODE_ENV'],
      Frontend: ['CLIENT_URL', 'FRONTEND_URL'],
      AI: ['GROQ_API_KEY', 'OPENAI_API_KEY', 'HUGGINGFACE_API_KEY'],
      OAuth: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'],
      Email: ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'],
      Storage: ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET']
    };

    for (const [group, vars] of Object.entries(serviceGroups)) {
      const configuredInGroup = vars.filter(v => result.configured.includes(v));
      if (configuredInGroup.length > 0) {
        console.log(`   ${group}: ${configuredInGroup.join(', ')}`);
      }
    }
  }

  console.log('\n' + '═'.repeat(50) + '\n');

  return result.valid;
}

/**
 * Validate and exit if errors are found
 */
export function validateEnvOrExit() {
  const result = validateEnv();
  const isValid = printValidationResults(result);

  if (!isValid) {
    console.error('❌ Environment validation failed. Please fix the errors above.');
    console.error('💡 Tip: Copy .env.example to .env and fill in the required values.\n');
    process.exit(1);
  }

  console.log('✅ Environment validation passed!\n');
  return result;
}

export default {
  validateEnv,
  printValidationResults,
  validateEnvOrExit
};
