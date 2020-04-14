const logger = require('winston');

const bootstrapConsumer = require('./consumer/bootstrap');

const container = bootstrapConsumer();

logger.info('Consumer starting');
container
    .resolve('app')
    .start();
