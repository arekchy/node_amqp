const logger = require('winston');

/**
 * ProducerApp - Producer index file
 */
class ProducerApp {
  /**
     * ProducerApp constructor
     * @param {QueueManager} queueManager - AMQP connection manager
     */
  constructor({queueManager, publishManager}) {
    this.queueManager = queueManager;
    this.publishManager = publishManager;
  }

  /**
     * Starts the app
     * @return {Promise<void>}
     */
  async start() {
    await this.queueManager.connect();

    logger.info('Producer started');
    await this.publishManager.startPublishing();
  }
}

module.exports = ProducerApp;
