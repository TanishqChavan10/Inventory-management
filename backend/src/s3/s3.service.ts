import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3_MODULE_OPTIONS } from './s3.constants';
import { S3ModuleOptions, UploadFileOptions, UploadResult, PresignedUrlOptions } from './s3.types';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    @Inject(S3_MODULE_OPTIONS)
    private readonly options: S3ModuleOptions,
  ) {
    this.s3Client = new S3Client({
      region: options.region || 'us-east-1',
      credentials: {
        accessKeyId: options.accessKeyId || '',
        secretAccessKey: options.secretAccessKey || '',
      },
    });
    this.bucketName = options.bucketName || '';
  }

  /**
   * Upload a file to S3
   */
  async uploadFile(options: UploadFileOptions): Promise<UploadResult> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: options.key,
        Body: options.body,
        ContentType: options.contentType,
        ACL: options.acl,
        Metadata: options.metadata,
      });

      const result = await this.s3Client.send(command);

      this.logger.log(`File uploaded successfully: ${options.key}`);

      return {
        key: options.key,
        location: `https://${this.bucketName}.s3.${this.s3Client.config.region}.amazonaws.com/${options.key}`,
        bucket: this.bucketName,
        etag: result.ETag || '',
      };
    } catch (error) {
      this.logger.error(`Error uploading file ${options.key}`, error);
      throw error;
    }
  }

  /**
   * Generate a presigned URL for downloading/uploading
   */
  async getPresignedUrl(options: PresignedUrlOptions): Promise<string> {
    try {
      const command = options.operation === 'putObject'
        ? new PutObjectCommand({
            Bucket: this.bucketName,
            Key: options.key,
          })
        : new GetObjectCommand({
            Bucket: this.bucketName,
            Key: options.key,
          });

      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: options.expiresIn || 3600, // 1 hour default
      });

      return signedUrl;
    } catch (error) {
      this.logger.error(`Error generating presigned URL for ${options.key}`, error);
      throw error;
    }
  }

  /**
   * Delete a file from S3
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting file ${key}`, error);
      throw error;
    }
  }

  /**
   * Check if a file exists in S3
   */
  async fileExists(key: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      this.logger.error(`Error checking file existence ${key}`, error);
      throw error;
    }
  }

  /**
   * List objects in the bucket
   */
  async listFiles(prefix?: string, maxKeys?: number) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: maxKeys,
      });

      const result = await this.s3Client.send(command);
      return result.Contents || [];
    } catch (error) {
      this.logger.error(`Error listing files with prefix ${prefix}`, error);
      throw error;
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(key: string) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const result = await this.s3Client.send(command);
      return result;
    } catch (error) {
      this.logger.error(`Error getting metadata for ${key}`, error);
      throw error;
    }
  }
}