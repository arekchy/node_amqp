const QueueConsumerService = require('./QueueConsumerService');
const ConsumerServiceEvent = require('../structures/ConsumerServiceEvent');
const EventEmitter = require('events');

describe('QueueConsumerService', () => {
  let service;
  const queueName = 'queue-name';
  const queueManager = new EventEmitter();
  queueManager.channel = {
    consume: jest.fn(),
    assertQueue: jest.fn(),
  };

  beforeEach(async () => {
    service = new QueueConsumerService({
      queueManager,
      queueName,
    });
  });

  describe('handleNewMessage', () => {
    it('should emit event', () => {
      const msg = {
        content: Buffer.from('test content'),
        fields: {
          exchange: 'exchange-name',
          routingKey: 'routing-key',
        },
      };

      service.emit = jest.fn();
      service.handleNewMessage(msg);
      expect(service.emit).toBeCalledWith(ConsumerServiceEvent.NEW_MESSAGE_EVENT, {
        content: msg.content.toString(),
        exchange: msg.fields.exchange,
        routingKey: msg.fields.routingKey,
      });
    });
  });
});
