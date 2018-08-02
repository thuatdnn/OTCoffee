'use strict';
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const emitter = require('socket.io-emitter');

module.exports = (app) => {
  app.IOEmitter = emitter({host: REDIS_HOST, port: REDIS_PORT});
};
