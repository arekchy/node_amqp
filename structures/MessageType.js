/**
 * AMQP MessageType
 * @type {{FANOUT: string, TOPIC: string, QUEUE: string, DIRECT: string}}
 */
const AmqpMessageType = {
  QUEUE: 'queue',
  FANOUT: 'fanout',
  DIRECT: 'direct',
  TOPIC: 'topic',
};

module.exports = AmqpMessageType;
