const logger = require('winston');

/**
 * ConsumerApp - Consumer index file
 */
class ConsumerApp {
  /**
     * ConsumerApp constructor
     * @param {QueueManager} queueManager - AMQP connection manager
     */
  constructor({queueManager, consumeManager}) {
    this.queueManager = queueManager;
    this.consumeManager = consumeManager;
  }

  /**
     * Starts the app
     * @return {Promise<void>}
     */
  async start() {
    await this.queueManager.connect();
    await this.consumeManager.startConsuming();
    logger.info('Consumer started');
  }
}

module.exports = ConsumerApp;
