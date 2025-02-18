import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | null = null;

export async function getRedisClient(): Promise<RedisClientType> {
  if (!redisClient) {
    redisClient = createClient({
      url: 'redis://localhost:6379',
    });

    redisClient.on('error', (err: any) => console.error(`Redis Error: ${err}`));
    redisClient.on('connect', () => console.log('Redis connected'));
    redisClient.on('ready', () => console.log('Redis ready'));
    redisClient.on('reconnecting', () => console.log('Redis reconnecting...'));

    await redisClient.connect();
  }
  return redisClient;
}
