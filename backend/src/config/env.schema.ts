import * as Joi from 'joi';

/**
 * Environment Variables Validation Schema using Joi
 * This schema validates all required and optional environment variables
 */
export const envValidationSchema = Joi.object({
  // Node Environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // Database Configuration
  DATABASE_URL: Joi.string()
    .required()
    .description('PostgreSQL database connection URL'),

  // JWT Configuration
  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .description('JWT secret key (minimum 32 characters)'),

  // Clerk Configuration
  CLERK_SECRET_KEY: Joi.string()
    .required()
    .description('Clerk secret key for backend verification'),

  CLERK_PUBLISHABLE_KEY: Joi.string()
    .required()
    .description('Clerk publishable key'),

  // GraphQL Configuration
  GRAPHQL_PLAYGROUND: Joi.boolean()
    .default(false)
    .description('Enable GraphQL playground'),

  // Database Synchronization (should be false in production)
  DB_SYNCHRONIZE: Joi.boolean()
    .default(false)
    .description('Synchronize database schema (dangerous in production)'),

  // Port Configuration
  PORT: Joi.number().default(3000).description('Application port'),

  // CORS Configuration
  CORS_ORIGIN: Joi.string()
    .default('http://localhost:3000')
    .description('CORS allowed origin'),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info')
    .description('Application log level'),
});

/**
 * Validate environment variables against the schema
 * @param env - The environment variables object
 * @returns Validation result
 */
export function validateEnvironment(env: Record<string, any>) {
  return envValidationSchema.validate(env, {
    allowUnknown: true, // Allow extra environment variables
    stripUnknown: false, // Don't remove unknown keys
  });
}
