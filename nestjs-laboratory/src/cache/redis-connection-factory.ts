import Redis from 'ioredis';

export function redisConnectionFactory() {
  const host = '127.0.0.1';

  const client = new Redis({
    sentinels: [
      {
        host: 'localhost',
        port: 26379,
      },
    ],
    name: 'redismaster',
  });

  return client;
}
