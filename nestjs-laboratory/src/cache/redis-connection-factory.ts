import Redis from 'ioredis';

export function redisConnectionFactory() {
  const host = '127.0.0.1';
  const port = 3306;

  const client = new Redis({
    sentinels: [
      {
        host,
        port: 26379,
      },
    ],
    name: 'mymaster',
    role: 'master',
  });

  return client;
}
