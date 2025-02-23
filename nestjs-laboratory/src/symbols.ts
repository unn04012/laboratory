export const Symbols = {
  configReader: Symbol.for('ConfigReader'),
  redisClient: Symbol.for('redisClient'),
  userVisitRepository: Symbol.for('userVisitRepository'),
  userSearchRepository: Symbol.for('userSearchRepository'),
  tokenManager: Symbol.for('TokenManager'),
  animalFactory: Symbol.for('AnimalFactory'),
  kafkaProducer: Symbol.for('KafkaConsumer'),
  kafkaIdempotentProducer: Symbol.for('KafkaIdempotentService'),
  kafkaConsumer: Symbol.for('KafkaConsumer'),
};

export const Tokens = {};
