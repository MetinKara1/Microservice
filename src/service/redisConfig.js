var config = {
  port: 3000,
  secret: 'secret',

  redisClient: {
    host: '192.168.1.6',
    port: '6379',
  },

  mongoClient: {
    host: 'mongodb://192.168.1.9',
    port: '27017',
  },
};
module.exports = config;
