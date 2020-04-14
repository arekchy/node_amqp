const EventEmitter = require('events');
const ExchangePublisherService = require('./ExchangePublisherService');

describe('ExchangePublisherService', () => {
  const exchangeName = 'ExName';
  const exchangeType = 'direct';
  const queueManager = new EventEmitter();
  queueManager.channel = {
    publish: jest.fn(),
    assertExchange: jest.fn(),
  };

  let service;
  beforeEach(async () => {
    service = new ExchangePublisherService({
      queueManager, exchangeName, exchangeType,
    });
  });

  it('whent not initialized, should not call publish method', async () => {
    const input = {
      msg: 'Test',
      type: 'direct',
      target: 'direct-target',
    };

    await service.publish(input);

    expect(queueManager.channel.publish).not.toBeCalled();
  });

  it('whent initialized, should call publish method', async () => {
    const input = {
      msg: 'Test',
      type: 'direct',
      target: 'direct-target',
    };
    await service.init();

    await service.publish(input);

    expect(queueManager.channel.assertExchange).toHaveBeenCalledWith(exchangeName, exchangeType, {
      durable: false,
    });
    expect(queueManager.channel.publish).toHaveBeenCalledWith(exchangeName, input.target, Buffer.from(input.msg));
  });
});
