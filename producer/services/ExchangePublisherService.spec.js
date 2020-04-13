const EventEmitter = require('events');
const ExchangePublisherService = require('./ExchangePublisherService');
const QueueManagerEvent = require('../../structures/QueueManagerEvent');

describe('ExchangePublisherService', () => {
  const exchangeName = 'ExName';
  const exchangeType = 'direct';
  const queueManager = new EventEmitter();
  queueManager.channel = {
    publish: jest.fn(),
    assertExchange: jest.fn(),
  };

  let service;
  beforeEach(() => {
    service = new ExchangePublisherService({
      queueManager, exchangeName, exchangeType,
    });
  });

  it('whent not initialized, should not call publish method', () => {
    const input = {
      msg: 'Test',
      type: 'direct',
      target: 'direct-target',
    };

    service.publish(input);

    expect(queueManager.channel.publish).not.toBeCalled();
  });

  it('whent initialized, should not call publish method', () => {
    const input = {
      msg: 'Test',
      type: 'direct',
      target: 'direct-target',
    };
    queueManager.emit(QueueManagerEvent.CHANNEL_CREATED_EVENT);

    service.publish(input);

    expect(queueManager.channel.assertExchange).toHaveBeenCalledWith(exchangeName, exchangeType, {
      durable: false,
    });
    expect(queueManager.channel.publish).toHaveBeenCalledWith(exchangeName, input.target, Buffer.from(input.msg));
  });
});
