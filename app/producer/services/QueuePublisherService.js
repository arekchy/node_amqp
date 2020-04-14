const QueueManagerEvent = require('../../structures/QueueManagerEvent');

/**
 * Publishes queue type messages to AMQP
 */
class QueuePublisherService {
  /**
     * QueuePublisherService constructor
     * @param {QueueManager} queueManager
     * @param {string} queueName
     */
  constructor({queueManager, queueName}) {
    this.connected = false;
    this.queueManager = queueManager;
    this.queueName = queueName;
    this.queueManager.on(QueueManagerEvent.CHANNEL_CREATED_EVENT, async () => {
      await this.init();
    });
  }

  /**
     * Prepare service before use
     */
  async init() {
    this.channel = this.queueManager.channel;
    await this.channel.assertQueue(this.queueName, {
      durable: false,
    });
    this.connected = true;
  }

  /**
     * Publishes message to AMQP
     * @param {Message} message
     */
  async publish(message) {
    if (!this.connected || !this.channel) {
      // TODO keep msgs locally until connected
      return;
    }
    await this.channel.sendToQueue(this.queueName, Buffer.from(message.msg));
  }
}

module.exports = QueuePublisherService;
