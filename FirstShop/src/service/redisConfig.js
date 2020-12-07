var config = {
  port: 3000,
  secret: 'secret',

  firstRedisClient: {
    host: '192.168.1.9',
    port: '6379',
  },

  secondRedisClient: {
    host: '192.168.1.6',
    port: '6379',
  },
};
module.exports = config;
