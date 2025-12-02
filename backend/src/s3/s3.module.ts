import { Module, DynamicModule, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';
import { S3_MODULE_OPTIONS } from './s3.constants';
import { S3ModuleOptions } from './s3.types';

@Global()
@Module({})
export class S3Module {
  static forRoot(options?: S3ModuleOptions): DynamicModule {
    return {
      module: S3Module,
      providers: [
        {
          provide: S3_MODULE_OPTIONS,
          useValue: options || {},
        },
        S3Service,
      ],
      exports: [S3Service],
      global: true,
    };
  }

  static forRootAsync(options?: {
    useFactory?: (configService: ConfigService) => S3ModuleOptions | Promise<S3ModuleOptions>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: S3Module,
      imports: [ConfigModule],
      providers: [
        {
          provide: S3_MODULE_OPTIONS,
          useFactory: options?.useFactory || ((configService: ConfigService) => ({
            accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
            region: configService.get('AWS_REGION', 'us-east-1'),
            bucketName: configService.get('S3_BUCKET_NAME'),
          })),
          inject: options?.inject || [ConfigService],
        },
        S3Service,
      ],
      exports: [S3Service],
      global: true,
    };
  }
}