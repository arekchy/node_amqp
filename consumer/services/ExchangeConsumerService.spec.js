const ExchangeConsumerService = require('./ExchangeConsumerService');
const ConsumerServiceEvent = require('../structures/ConsumerServiceEvent');

describe('ExchangeConsumerService', () => {
  let service;
  const exchangeName = 'exchange-name';
  const exchangeType = 'exchange-type';
  const routingKey = 'routing-key';
  const queueName = 'q-name';

  let queueManager;


  beforeEach(async () => {
    jest.resetAllMocks();

    queueManager = {
      channel: {
        consume: jest.fn(),
        assertQueue: jest.fn().mockResolvedValue(Promise.resolve({queue: queueName})),
        assertExchange: jest.fn(),
        bindQueue: jest.fn(),
      },
    };

    service = new ExchangeConsumerService({
      queueManager,
      exchangeName,
      exchangeType,
      routingKey,
    });
  });

  describe('init', () => {
    it('should bind queue', async () => {
      await service.init();
      expect(service.channel.bindQueue).toBeCalledWith(queueName, exchangeName, routingKey);
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
