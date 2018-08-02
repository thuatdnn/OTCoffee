require('dotenv').config();

const cors = require('cors');
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server, {pingTimeout: 30000});
const redis = require('socket.io-redis');
const jwt = require('jsonwebtoken');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 8800;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'OTCoffee.!@2018$#';

io.on('connection', socket => {
  socket.client.user = null;
  setTimeout(() => {
    if (!socket.client.user) {
      socket.disconnect(true);
    }
  }, 10000);

  socket.use((packet, next) => {
    if (packet[0] !== 'authenticate' && !socket.client.user) {
      console.log('Authentication error');
      socket.disconnect(true);
      return next(new Error('Authentication error'));
    }
    return next();
  });

  socket.on('authenticate', data => {
    try {
      const {id} = jwt.verify(data.accessToken, JWT_SECRET_KEY);
      socket.client.user = {id};
      socket.emit('authenticated');
    } catch (error) {
      socket.disconnect(true);
    }
  });

  socket.on('join', data => {
    socket.join(data);
  });

  socket.on('leave', data => {
    socket.leave(data);
  });
});
io.adapter(redis({host: REDIS_HOST, port: REDIS_PORT}));

app.use(cors());
server.listen(PORT, HOST, () => {
  console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});