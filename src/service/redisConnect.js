const config = require('./redisConfig');
//Redis
const redis = require('redis');
const redisClient = redis.createClient(config.redisClient); //creates a new client

//Redis Connect
redisClient.on('connect', function () {
  console.log('Redis firstRedisClient bağlandı');
});

redisClient.on('error', function (err) {
  console.log('Redis firstRedisClient bir hata var ' + err);
});

module.exports = {redisClient};
