const awilix = require('awilix');
const {assertRequiredEnvVar} = require('../helpers/assertEnvVar');
const config = require('../config');

const QueueManager = require('../managers/QueueManager');
const ConsumerApp = require('./ConsumerApp');
const ConsumeManager = require('./managers/ConsumeManager');

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

  });

  return container;
};

module.exports = setupContainer;
