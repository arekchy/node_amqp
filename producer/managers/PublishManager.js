const AmqpMessageType = require('../../structures/MessageType');
const logger = require('winston');

/**
 * PublishManager - manage frequency and type of messages sent to queue
 */
class PublishManager {
  /**
   * PublishManager constructor
   * @param {MessageGeneratorService} messageGeneratorService - utility for creating messages
   * @param {number} messageFrequency - messages frequency created by manager
   * @param {QueuePublisherService} queuePublisherService - responsible for publishing messages to queue
   * @param {ExchangePublisherService} fanoutPublisherService - responsible for publishing messages to fanout exchange
   * @param {ExchangePublisherService} directPublisherService - responsible for publishing messages to direct exchange
   * @param {ExchangePublisherService} topicPublisherService - responsible for publishing messages to topic exchange
   */
  constructor({
                messageGeneratorService,
                messageFrequency,
                queuePublisherService,
                fanoutPublisherService,
                directPublisherService,
                topicPublisherService,
              }) {
    this.messageGeneratorService = messageGeneratorService;
    this.interval = this.calculateIntervalForFrequency(messageFrequency);

    this.queuePublisherService = queuePublisherService;
    this.fanoutPublisherService = fanoutPublisherService;
    this.directPublisherService = directPublisherService;
    this.topicPublisherService = topicPublisherService;
  }

  /**
   * Calculates interval from frequency
   * @param {number} frequency - in Hz
   * @return {number} - interval in ms
   */
  calculateIntervalForFrequency(frequency) {
    if (frequency <= 0) {
      throw Error('Frequency has to be positive number');
    }
    return 1000 / frequency;
  }

  /**
   * Triggers messages publish
   */
  startPublishing() {
    setInterval(() => {
      this.publish(this.prepareMessage());
    }, this.interval);
  }

  /**
   * Generates random type messages
   * @return {Message}
   */
  prepareMessage() {
    return this.messageGeneratorService.generateRandomMessage();
  }

  /**
   * Publish message to AMQP
   * @param {Message} message - data to publish
   */
  publish(message) {
    switch (message.type) {
      case AmqpMessageType.QUEUE:
        this.queuePublisherService.publish(message);
        break;
      case AmqpMessageType.FANOUT:
        this.fanoutPublisherService.publish(message);
        break;
      case AmqpMessageType.DIRECT:
        this.directPublisherService.publish(message);
        break;
      case AmqpMessageType.TOPIC:
        this.topicPublisherService.publish(message);
        break;
    }
    logger.info(`Sent as ${message.type}`, message);
  }
}

module.exports = PublishManager;
