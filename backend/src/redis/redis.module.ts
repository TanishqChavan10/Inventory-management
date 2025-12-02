import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisModuleOptions } from './redis.types';

@Global()
@Module({})
export class RedisModule {
  static forRoot(options?: RedisModuleOptions): DynamicModule {
    return {
      module: RedisModule,
      providers: [
        {
          provide: REDIS_MODULE_OPTIONS,
          useValue: options || {},
        },
        RedisService,
      ],
      exports: [RedisService],
      global: true,
    };
  }

  static forRootAsync(options?: {
    useFactory?: (configService: ConfigService) => RedisModuleOptions | Promise<RedisModuleOptions>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: RedisModule,
      imports: [ConfigModule],
      providers: [
        {
          provide: REDIS_MODULE_OPTIONS,
          useFactory: options?.useFactory || ((configService: ConfigService) => ({
            host: configService.get('REDIS_HOST', 'localhost'),
            port: configService.get('REDIS_PORT', 6379),
            password: configService.get('REDIS_PASSWORD'),
            db: configService.get('REDIS_DB', 0),
            url: configService.get('REDIS_URL'),
          })),
          inject: options?.inject || [ConfigService],
        },
        RedisService,
      ],
      exports: [RedisService],
      global: true,
    };
  }
}