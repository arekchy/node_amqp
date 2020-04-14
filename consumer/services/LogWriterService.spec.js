const fs = require('fs');
const LogWriterService = require('./LogWriterService');
jest.mock('fs');

describe('LogWriterService', () => {
  let service;
  beforeEach(async () => {
    service = new LogWriterService();
  });

  it('should create writable stream', () => {
    expect(fs.createWriteStream).toBeCalledWith('consumer.log');
  });

  describe('logToFile', () => {
    it('should log message data to file', () => {
      const msg = {
        content: 'test content',
        exchange: 'exchange-name',
        routingKey: 'routing-key',
      };

      service.wstream = {};
      service.wstream.write = jest.fn();

      service.logToFile(msg);

      expect(service.wstream.write).toBeCalledWith(`Content: ${msg.content}, routingKey: ${msg.routingKey}, exchange: ${msg.exchange}\n`)
    });
  });
});
