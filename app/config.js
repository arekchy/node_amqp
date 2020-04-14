module.exports = {
  AMQP_TARGETS: {
    QUEUE_NAME: 'test-queue',
    FANOUT_EXCHANGE: 'fanout-exchange',
    DIRECT_EXCHANGE: 'direct-exchange',
    DIRECT_KEY_1: 'key1',
    DIRECT_KEY_2: 'key2',
    TOPIC_EXCHANGE: 'topic-exchange',
    TOPIC: 'topic.*.success',
  },
};
