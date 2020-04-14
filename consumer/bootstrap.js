const winston = require('winston');
const dotenv = require('dotenv');
const setupContainer = require('./container');

const bootstrapProducer = () => {
  dotenv.config({
    path: './env/consumer.local.env',
  });

  const uid = Date.now();
  winston.configure({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: `consumer_${uid}`},
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });

  return setupContainer();
};

module.exports = bootstrapProducer;
