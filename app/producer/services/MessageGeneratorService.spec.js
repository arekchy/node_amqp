const MessageGeneratorService = require('./MessageGeneratorService');
const AmqpMessageType = require('../../structures/MessageType');
const config = require('../../config');

describe('MessageGenerator', () => {
  let service;

  beforeEach(() => {
    service = new MessageGeneratorService();
  });

  it('should return Message', () => {
    const result = service.generateRandomMessage();
    expect(result.msg).toEqual(expect.any(String));
    expect(Object.values(AmqpMessageType)).toContain(result.type);
  });

  it('should return Message of Queue type', () => {
    const result = service.generateQueueMessage();
    expect(result).toEqual({
      msg: expect.any(String),
      type: AmqpMessageType.QUEUE,
    });
  });

  it('should return Message of Direct type', () => {
    const result = service.generateDirectMessage();
    expect(result).toEqual({
      msg: expect.any(String),
      type: AmqpMessageType.DIRECT,
      target: expect.any(String),
    });
    expect([config.AMQP_TARGETS.DIRECT_KEY_1, config.AMQP_TARGETS.DIRECT_KEY_2]).toContain(result.target);
  });

  it('should return Message of Topic type', () => {
    const result = service.generateTopicMessage();
    expect(result).toEqual({
      msg: expect.any(String),
      type: AmqpMessageType.TOPIC,
      target: expect.stringMatching(/topic\..*\.(failed|success)/ig),
    });
  });
});
