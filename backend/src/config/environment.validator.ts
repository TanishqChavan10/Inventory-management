import { ConfigService } from '@nestjs/config';

/**
 * Environment Configuration Validator
 * This utility helps validate that all required environment variables are set
 */
export class EnvironmentValidator {
  constructor(private configService: ConfigService) {}

  validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const requiredEnvVars = [
      'DATABASE_URL',
      'JWT_SECRET'
    ];

    // Check required variables
    requiredEnvVars.forEach(envVar => {
      const value = this.configService.get(envVar);
      if (!value || value === '') {
        errors.push(`Missing required environment variable: ${envVar}`);
      }
    });

    // Validate JWT secret strength
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (jwtSecret && jwtSecret.length < 32) {
      errors.push('JWT_SECRET should be at least 32 characters long for security');
    }

    // Production-specific validations
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    if (nodeEnv === 'production') {
      const dbSync = this.configService.get<boolean>('DB_SYNCHRONIZE');
      if (dbSync === true) {
        errors.push('DB_SYNCHRONIZE should be false in production environment');
      }

      const playground = this.configService.get<boolean>('GRAPHQL_PLAYGROUND');
      if (playground === true) {
        errors.push('GRAPHQL_PLAYGROUND should be false in production environment');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  logConfiguration(): void {
    console.log('🔧 Environment Configuration:');
    console.log(`   NODE_ENV: ${this.configService.get('NODE_ENV', 'development')}`);
    console.log(`   PORT: ${this.configService.get('PORT', 5000)}`);
    console.log(`   DATABASE_URL: ${this.configService.get('DATABASE_URL') ? '***SET***' : '***NOT SET***'}`);
    console.log(`   GRAPHQL_PATH: ${this.configService.get('GRAPHQL_PATH', '/api/graphql')}`);
    console.log(`   CORS_ORIGIN: ${this.configService.get('CORS_ORIGIN', 'http://localhost:3000')}`);
    
    // Don't log sensitive information
    console.log(`   JWT_SECRET: ${this.configService.get('JWT_SECRET') ? '***SET***' : '***NOT SET***'}`);
  }
}