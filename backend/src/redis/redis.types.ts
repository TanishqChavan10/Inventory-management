export interface RedisModuleOptions {
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  url?: string;
  retryDelay?: number;
  maxRetries?: number;
}

export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttl?: number): Promise<string | null>;
  del(key: string): Promise<number>;
  expire(key: string, ttl: number): Promise<number>;
  exists(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  // Add more methods as needed
}