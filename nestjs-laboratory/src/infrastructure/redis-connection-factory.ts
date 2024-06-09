import type { RedisClientOptions } from 'redis';
import { RedisConfig } from '../config/config-redis';
import { redisStore } from 'cache-manager-redis-yet';

export async function redisConnectionFactory({ host, port }: RedisConfig) {
  const store = await redisStore({ socket: { host, port } });

  return { store };
}
