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
  constructor({queueConsumerService}) {
    this.queueConsumerService = queueConsumerService;
  }

  /**
   * Starts process of consuming messages from multiple sources
   */
  startConsuming() {
    this.queueConsumerService.on(ConsumerServiceEvent.NEW_MESSAGE_EVENT, (msg) => {
      this.logMessage(msg);
    });

    this.queueConsumerService.startConsuming();
  }


  /**
   * Handling received messages, passing to log writer
   * @param {ConsumedMessage} msg
   */
  logMessage(msg) {
    console.log(msg.content);
  }
}

module.exports = ConsumeManager;
