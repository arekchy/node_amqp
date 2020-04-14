const ConsumerServiceEvent = require('../structures/ConsumerServiceEvent');
const EventEmitter = require('events');

/**
 * Consumes messages from queue binded to exchange
 */
class ExchangeConsumerService extends EventEmitter {
  /**
   * QueueConsumerService constructor
   * @param {QueueManager} queueManager
   * @param {string} queueName
   */
  constructor({queueManager, exchangeName, exchangeType, routingKey}) {
    super();

    this.queueManager = queueManager;
    this.exchangeName = exchangeName;
    this.exchangeType = exchangeType;
    this.routingKey = routingKey || '';
    this.channel = this.queueManager.channel;
  }

  /**
   * Prepare service before use
   */
  async init() {
    await this.channel.assertExchange(this.exchangeName, this.exchangeType, {
      durable: false,
    });
    const q = await this.channel.assertQueue('', {
      exclusive: true,
    });

    this.queueName = q.queue;
    this.channel.bindQueue(q.queue, this.exchangeName, this.routingKey);
  }

  /**
   * Starts consuming process
   * Emit event when new message comes
   */
  startConsuming() {
    if (!this.channel) {
      return;
    }
    this.channel.consume(this.queueName, (msg) => {
      this.handleNewMessage(msg);
    }, {
      noAck: true,
    });
  }

  /**
   * Handle new message from queue
   * @param {*} msg
   */
  handleNewMessage(msg) {
    if (msg.content) {
      this.emit(ConsumerServiceEvent.NEW_MESSAGE_EVENT, {
        content: msg.content.toString(),
        routingKey: msg.fields.routingKey,
        exchange: msg.fields.exchange,
      });
    }
  }
}

module.exports = ExchangeConsumerService;
