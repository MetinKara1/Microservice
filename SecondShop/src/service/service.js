const express = require('express');
const app = express();
const server = require('http').createServer(app);
const cors = require('cors');
const http = require('http');

// redis connection
const redis = require('./redisConnect');

// mongo connection
const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://192.168.1.9:27017';
const config = require('./redisConfig');

app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/get', (req, res) => {
  console.log('get methodu çalıştı');
  if (redis.redisClient.connected) {
    redis.redisClient.get('stock', (error, rep) => {
      console.log('redisDataaa', rep);
      if (rep === null) {
        app.get('192.168.1.9:3000/get', (req, res) => {
          if (res !== null) {
            console.log('mongo db data', res);
          } else {
            console.log('hata!!!!!');
          }
        });

        mongo.connect(
          mongoUrl,
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
          (err, client) => {
            if (err) throw err;
            const db = client.db('mylib');
            const collection = db.collection('persons');
            collection.findOne({productId: 123}, (err, item) => {
              redis.redisClient.hmset('stock', {
                stock: item.stock,
              });
              res.send(item);
            });
          }
        );
      } else {
        return res.send(rep);
      }
    });
  } else {
    console.log('mongoruningggggggg');
    let parseData = {};
    http
      .get('http://192.168.1.9:3000/get', response => {
        response.on('data', data => {
          if (data) {
            // parseData = JSON.parse(data);
            res.send(data);
          } else {
            console.log('dd', data);
          }
        });
        response.on('end', () => {
          // let url = JSON.parse(data)
          console.log('end çalıştı');
        });
      })
      .on('error', err => {
        console.log('erorrr messageeeeeeee', err);
      });
  }
});

server.listen(3000, () => {
  console.log('runing...');
});
