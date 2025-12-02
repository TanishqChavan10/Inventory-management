export interface S3ModuleOptions {
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  bucketName?: string;
}

export interface UploadFileOptions {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
  acl?: 'private' | 'public-read' | 'public-read-write';
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  location: string;
  bucket: string;
  etag: string;
}

export interface PresignedUrlOptions {
  key: string;
  expiresIn?: number; // seconds
  operation?: 'getObject' | 'putObject';
}