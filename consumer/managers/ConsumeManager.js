const ConsumerServiceEvent = require('../structures/ConsumerServiceEvent');

/**
 * Consumed Message
 * @typedef {Object} ConsumedMessage
 * @property {string} content - message body
 * @property {string} routingKey
 * @property {string} exchange - Exchange name
 */

/**
 * ConsumeManager - responsible handling AMQP messages
 */
class ConsumeManager {
  /**
   * ConsumeManager constructor
   * @param {QueueConsumerService} queueConsumerService - simple queue messages listener
   */
  constructor({
    logWriterService,
    queueConsumerService,
    fanoutConsumerService,
    direct1ConsumerService,
    direct2ConsumerService,
    topicConsumerService,
  }) {
    this.queueConsumerService = queueConsumerService;
    this.fanoutConsumerService = fanoutConsumerService;
    this.direct1ConsumerService = direct1ConsumerService;
    this.direct2ConsumerService = direct2ConsumerService;
    this.topicConsumerService = topicConsumerService;
    this.logWriterService = logWriterService;
  }

  /**
   * Starts process of consuming messages from multiple sources
   */
  async startConsuming() {
    this.queueConsumerService.on(ConsumerServiceEvent.NEW_MESSAGE_EVENT, (msg) => {
      this.logMessage(msg);
    });
    this.queueConsumerService.startConsuming();

    this.fanoutConsumerService.on(ConsumerServiceEvent.NEW_MESSAGE_EVENT, (msg) => {
      this.logMessage(msg);
    });
    await this.fanoutConsumerService.init();
    this.fanoutConsumerService.startConsuming();

    this.direct1ConsumerService.on(ConsumerServiceEvent.NEW_MESSAGE_EVENT, (msg) => {
      this.logMessage(msg);
    });
    await this.direct1ConsumerService.init();
    this.direct1ConsumerService.startConsuming();

    this.direct2ConsumerService.on(ConsumerServiceEvent.NEW_MESSAGE_EVENT, (msg) => {
      this.logMessage(msg);
    });
    await this.direct2ConsumerService.init();
    this.direct2ConsumerService.startConsuming();

    this.topicConsumerService.on(ConsumerServiceEvent.NEW_MESSAGE_EVENT, (msg) => {
      this.logMessage(msg);
    });
    await this.topicConsumerService.init();
    this.topicConsumerService.startConsuming();
  }


  /**
   * Handling received messages, passing to log writer
   * @param {ConsumedMessage} msg
   */
  logMessage(msg) {
    console.log(msg.content);
    this.logWriterService.logToFile(msg);
  }
}

module.exports = ConsumeManager;
