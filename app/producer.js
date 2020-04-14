const logger = require('winston');

const bootstrapProducer = require('./producer/bootstrap');

const container = bootstrapProducer();

logger.info('Producer starting');
container
    .resolve('app')
    .start();
