const logger = require('winston');
const QueueManagerEvent = require('../structures/QueueManagerEvent');

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
    try {
      this.queueManager.on(QueueManagerEvent.CHANNEL_CREATED_EVENT,  async () => {
        await this.consumeManager.startConsuming();
      });
      await this.queueManager.connect();
    } catch (e) {
      process.exit(1);
    }
    logger.info('Consumer started');
  }
}

module.exports = ConsumerApp;
