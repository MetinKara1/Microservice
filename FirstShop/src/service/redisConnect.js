const config = require('./redisConfig');
//Redis
const redis = require('redis');
const firstRedisClient = redis.createClient(config.firstRedisClient); //creates a new client
const secondRedisClient = redis.createClient(config.secondRedisClient); //creates a new client

//Redis Connect
firstRedisClient.on('connect', function () {
  console.log('Redis firstRedisClient bağlandı');
});

firstRedisClient.on('error', function (err) {
  console.log('Redis firstRedisClient bir hata var ' + err);
});

//Redis Connect
secondRedisClient.on('connect', function () {
  console.log('Redis secondRedisClient bağlandı');
});

secondRedisClient.on('error', function (err) {
  console.log('Redis secondRedisClient bir hata var ' + err);
});

module.exports = {firstRedisClient, secondRedisClient};
