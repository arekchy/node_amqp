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
    try {
      await this.queueManager.connect();
      await this.publishManager.startPublishing();
    } catch (e) {
      process.exit(1);
    }

    logger.info('Producer started');
  }
}

module.exports = ProducerApp;
