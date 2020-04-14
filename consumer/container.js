const awilix = require('awilix');
const {assertRequiredEnvVar} = require('../helpers/assertEnvVar');
const config = require('../config');

const QueueManager = require('../managers/QueueManager');
const ConsumerApp = require('./ConsumerApp');
const ConsumeManager = require('./managers/ConsumeManager');
const QueueConsumerService = require('./services/QueueConsumerService');
const ExchangeConsumerService = require('./services/ExchangeConsumerService');
const LogWriterService = require('./services/LogWriterService');

const setupContainer = () => {
  const container = awilix.createContainer();

  // ENVS
  container.register({
    amqpConnectionString: awilix.asValue(assertRequiredEnvVar('AMQP_CONNECTION_STRING')),
  });

  // MANAGERS
  container.register({
    app: awilix.asClass(ConsumerApp),
    queueManager: awilix.asClass(QueueManager).singleton(),
    consumeManager: awilix.asClass(ConsumeManager),
  });

  // SERVICES
  container.register({
    logWriterService: awilix.asClass(LogWriterService).singleton(),
    queueConsumerService: awilix.asFunction(({queueManager}) => {
      return new QueueConsumerService({
        queueManager,
        queueName: config.AMQP_TARGETS.QUEUE_NAME,
      });
    }),
    fanoutConsumerService: awilix.asFunction(({queueManager}) => {
      return new ExchangeConsumerService({
        queueManager,
        exchangeName: config.AMQP_TARGETS.FANOUT_EXCHANGE,
        exchangeType: 'fanout',
      });
    }),
    direct1ConsumerService: awilix.asFunction(({queueManager}) => {
      return new ExchangeConsumerService({
        queueManager,
        exchangeName: config.AMQP_TARGETS.DIRECT_EXCHANGE,
        exchangeType: 'direct',
        routingKey: config.AMQP_TARGETS.DIRECT_KEY_1,
      });
    }),
    direct2ConsumerService: awilix.asFunction(({queueManager}) => {
      return new ExchangeConsumerService({
        queueManager,
        exchangeName: config.AMQP_TARGETS.DIRECT_EXCHANGE,
        exchangeType: 'direct',
        routingKey: config.AMQP_TARGETS.DIRECT_KEY_2,
      });
    }),
    topicConsumerService: awilix.asFunction(({queueManager}) => {
      return new ExchangeConsumerService({
        queueManager,
        exchangeName: config.AMQP_TARGETS.TOPIC_EXCHANGE,
        exchangeType: 'topic',
        routingKey: config.AMQP_TARGETS.TOPIC,
      });
    }),
  });

  return container;
};

module.exports = setupContainer;
