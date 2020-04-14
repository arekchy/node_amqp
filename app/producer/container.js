const awilix = require('awilix');
const {assertRequiredEnvVar} = require('../helpers/assertEnvVar');
const config = require('../config');

const QueueManager = require('../managers/QueueManager');
const ProducerApp = require('./ProducerApp');
const MessageGeneratorService = require('./services/MessageGeneratorService');
const PublishManager = require('./managers/PublishManager');
const QueuePublisherService = require('./services/QueuePublisherService');
const ExchangePublisherService = require('./services/ExchangePublisherService');

const setupContainer = () => {
  const container = awilix.createContainer();

  // ENVS
  container.register({
    amqpConnectionString: awilix.asValue(assertRequiredEnvVar('AMQP_CONNECTION_STRING')),
    messageFrequency: awilix.asValue(assertRequiredEnvVar('MSG_FREQUENCY')),
  });

  // MANAGERS
  container.register({
    app: awilix.asClass(ProducerApp),
    queueManager: awilix.asClass(QueueManager).singleton(),
    publishManager: awilix.asClass(PublishManager),
  });

  // SERVICES
  container.register({
    messageGeneratorService: awilix.asClass(MessageGeneratorService),
    queuePublisherService: awilix.asFunction(({queueManager}) => {
      return new QueuePublisherService({
        queueManager,
        queueName: config.AMQP_TARGETS.QUEUE_NAME,
      });
    }),
    fanoutPublisherService: awilix.asFunction(({queueManager}) => {
      return new ExchangePublisherService({
        queueManager,
        exchangeName: config.AMQP_TARGETS.FANOUT_EXCHANGE,
        exchangeType: 'fanout',
      });
    }),
    directPublisherService: awilix.asFunction(({queueManager}) => {
      return new ExchangePublisherService({
        queueManager,
        exchangeName: config.AMQP_TARGETS.DIRECT_EXCHANGE,
        exchangeType: 'direct',
      });
    }),
    topicPublisherService: awilix.asFunction(({queueManager}) => {
      return new ExchangePublisherService({
        queueManager,
        exchangeName: config.AMQP_TARGETS.TOPIC_EXCHANGE,
        exchangeType: 'topic',
      });
    }),
  });

  return container;
};

module.exports = setupContainer;
