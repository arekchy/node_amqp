const PublishManager = require('./PublishManager');
const AmqpMessageType = require('../../structures/MessageType');
jest.mock('winston');

describe('PublishManager', () => {
  const messageGeneratorService = {
    generateRandomMessage: jest.fn(),
  };
  const messageFrequency = 1;
  const queuePublisherService = {
    publish: jest.fn(),
  };
  const fanoutPublisherService = {
    publish: jest.fn(),
  };
  const directPublisherService = {
    publish: jest.fn(),
  };
  const topicPublisherService = {
    publish: jest.fn(),
  };

  let manager;
  beforeEach(() => {
    jest.resetAllMocks();
    manager = new PublishManager({
      messageGeneratorService,
      messageFrequency,
      queuePublisherService,
      fanoutPublisherService,
      directPublisherService,
      topicPublisherService,
    });
  });

  describe('calculateIntervalForFrequency', () => {

    it('for 1Hz should be 1000 [ms]', () => {
      expect(manager.calculateIntervalForFrequency(1)).toBe(1000);
    });

    it('for 0.5Hz should be 2000 [ms]', () => {
      expect(manager.calculateIntervalForFrequency(0.5)).toBe(2000);
    });

    it('for 0Hz should throw Error', () => {
      expect(() => {
        manager.calculateIntervalForFrequency(0)
      }).toThrow('Frequency has to be positive number')
    });

  });

  describe('startPublishing', () => {
    it('after 3 seconds after startPublishing should publish message 3 times', () => {
      messageGeneratorService.generateRandomMessage.mockImplementation(() => {
        return {
          type: AmqpMessageType.QUEUE,
          msg: '',
        }
      });

      jest.useFakeTimers();
      manager.startPublishing();
      jest.advanceTimersByTime(3000);
      expect(queuePublisherService.publish).toBeCalledTimes(3);
    });
  });

  describe('publish', () => {
    it('should publish to queue', () => {
      const input = {
        type: AmqpMessageType.QUEUE,
        msg: 'test',
      };

      manager.publish(input);

      expect(queuePublisherService.publish).toBeCalledWith(input);
    });

    it('should publish to exchange - fanout', () => {
      const input = {
        type: AmqpMessageType.FANOUT,
        msg: 'test',
      };

      manager.publish(input);

      expect(fanoutPublisherService.publish).toBeCalledWith(input);
    });

    it('should publish to exchange - direct', () => {
      const input = {
        type: AmqpMessageType.DIRECT,
        msg: 'test',
        target: 'key',
      };

      manager.publish(input);

      expect(directPublisherService.publish).toBeCalledWith(input);
    });

    it('should publish to exchange - topic', () => {
      const input = {
        type: AmqpMessageType.TOPIC,
        msg: 'test',
        target: 'key.abc',
      };

      manager.publish(input);

      expect(topicPublisherService.publish).toBeCalledWith(input);
    });

  });
});
