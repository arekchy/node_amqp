const amqp = require('amqplib');
const logger = require('winston');
const EventEmitter = require('events');
const QueueManagerEvent = require('../structures/QueueManagerEvent');

/**
 * QueueManager - responsible for AMQP connecting, reconnecting and handling errors
 */
class QueueManager extends EventEmitter {
  /**
     * QueueManager constructor
     * @param {string} amqpConnectionString - connection string to RabbitMQ
     */
  constructor({amqpConnectionString}) {
    super();
    this.RECONNECTION_TIMEOUT = 5000;
    this.amqpConnectionString = amqpConnectionString;
  }

  /**
     * Attempts to connect with AMQP
     * @return {Promise<void>}
     */
  async connect() {
    try {
      this.connection = await amqp.connect(this.amqpConnectionString);
    } catch (e) {
      if (e.code === 'ECONNREFUSED' ||
                e.message === 'Socket closed abruptly during opening handshake') {
        setTimeout(() => {
          this.connect();
        }, this.RECONNECTION_TIMEOUT);
        return;
      }

      throw e;
    }

    this.connection.on('error', this.onConnectionErrorHandler.bind(this));
    this.connection.on('close', this.onConnectionCloseHandler.bind(this));

    logger.info('[AMQP] connected');

    await this.createChannel();
  }

  /**
     * Creates connection channel
     * @return {Promise<Channel>}
     */
  async createChannel() {
    try {
      this.channel = await this.connection.createChannel();
    } catch (e) {
      logger.error('[AMQP] error', e);
      this.connection.close();
    }

    this.channel.on('error', (err) => {
      logger.error('[AMQP] channel error', err.message);
    });
    this.channel.on('close', () => {
      logger.info('[AMQP] channel closed');
    });

    logger.info('[AMQP] channel created');

    this.emit(QueueManagerEvent.CHANNEL_CREATED_EVENT);
    return this.channel;
  }

  /**
     * Handle connection error
     * @param {object} error
     */
  onConnectionErrorHandler(error) {
    if (error.message !== 'Connection closing') {
      logger.error(`[AMQP] conn error: ${error.message}`, error);
      if (this.connection) {
        this.connection.close();
      }
    }
  }

  /**
   * Handle connection close event and tries to reconnect
   */
  onConnectionCloseHandler() {
    logger.error('[AMQP] reconnecting');
    setTimeout(async () => {
      await this.connect();
    }, this.RECONNECTION_TIMEOUT);
  }
}

module.exports = QueueManager;
