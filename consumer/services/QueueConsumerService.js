const QueueManagerEvent = require('../../structures/QueueManagerEvent');
const ConsumerServiceEvent = require('../structures/ConsumerServiceEvent');
const EventEmitter = require('events');

/**
 * Consumes messages from simple queue
 */
class QueueConsumerService extends EventEmitter {
  /**
   * QueueConsumerService constructor
   * @param {QueueManager} queueManager
   * @param {string} queueName
   */
  constructor({queueManager, queueName}) {
    super();

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
  }

  /**
   * Starts consuming process
   * Emit event when new message comes
   */
  startConsuming() {
    this.channel.consume(this.queueName, (msg) => {
      if (msg.content) {
        this.emit(ConsumerServiceEvent.NEW_MESSAGE_EVENT, {
          content: msg.content.toString(),
          routingKey: msg.fields.routingKey,
          exchange: msg.fields.exchange,
        });
      }
    }, {
      noAck: true,
    });
  }
}

module.exports = QueueConsumerService;
