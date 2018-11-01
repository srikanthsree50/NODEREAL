'use strict';
const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';
const errorDir = '../logs/error';
const dataDir = '../logs/data';

// Create the log directory if it does not exist
if (!fs.existsSync(errorDir)) {
  fs.mkdirSync(errorDir);
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'text',
      filename: `${dataDir}/results.log`,
      timestamp: tsFormat,
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'json',
      filename: `${errorDir}/errors.log`,
      timestamp: tsFormat,
      level: 'error'
    })
  ]
});
logger.info('Hello world');
logger.error('Error log');
logger.warn('Warning message');
logger.debug('Debugging info');
