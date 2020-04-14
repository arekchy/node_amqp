const logger = require('winston');
const QueueManagerEvent = require('../structures/QueueManagerEvent');

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
      this.queueManager.on(QueueManagerEvent.CHANNEL_CREATED_EVENT,  async () => {
        await this.publishManager.startPublishing();
      });
      await this.queueManager.connect();
    } catch (e) {
      process.exit(1);
    }

    logger.info('Producer started');
  }
}

module.exports = ProducerApp;
