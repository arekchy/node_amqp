const AmqpMessageType = require('../../structures/MessageType');
const config = require('../../config');
const getArrayRandomElement = require('../../helpers/getArrayRandomElement');

/**
 * AMQP Message
 * @typedef {Object} Message
 * @property {string} msg - message body
 * @property {AmqpMessageType} type - message type
 * @property {string} [target] - AMQP routing key, for direct and topic exchange or queue name
 */

/**
 * Generates random messages for AMQP
 */
class MessageGeneratorService {
  /**
     *  Generates random type messages
     * @return {Message}
     */
  generateRandomMessage() {
    return getArrayRandomElement([
      this.generateDirectMessage,
      this.generateQueueMessage,
      this.generateFanoutMessage,
      this.generateTopicMessage,
    ])();
  }

  /**
     *  Generates queue message type
     * @return {Message}
     */
  generateQueueMessage() {
    return {
      type: AmqpMessageType.QUEUE,
      msg: `Queue test message ${Date.now()}`,
    };
  }

  /**
     *  Generates fanout message type
     * @return {Message}
     */
  generateFanoutMessage() {
    return {
      type: AmqpMessageType.FANOUT,
      msg: `Fanout message ${Date.now()}`,
    };
  }

  /**
     *  Generates direct message type
     * @return {Message}
     */
  generateDirectMessage() {
    return {
      type: AmqpMessageType.DIRECT,
      target: getArrayRandomElement([config.AMQP_TARGETS.DIRECT_KEY_1, config.AMQP_TARGETS.DIRECT_KEY_2]),
      msg: `Direct message ${Date.now()}`,
    };
  }

  /**
     *  Generates topic message type
     * @return {Message}
     */
  generateTopicMessage() {
    const topicParts = config.AMQP_TARGETS.TOPIC.split('.');
    return {
      type: AmqpMessageType.TOPIC,
      target: `${topicParts[0]}.${Date.now()}.${getArrayRandomElement(['failed', topicParts[2]])}`,
      msg: `Topic message ${Date.now()}`,
    };
  }
}

module.exports = MessageGeneratorService;
