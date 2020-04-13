const winston = require('winston');
const dotenv = require('dotenv');
const setupContainer = require('./container');

const bootstrapProducer = () => {
  dotenv.config({
    path: './env/producer.env',
  });

  const uid = Date.now();
  winston.configure({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {service: `producer_${uid}`},
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ],
  });

  return setupContainer();
};

module.exports = bootstrapProducer;
