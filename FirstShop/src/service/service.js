const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var cors = require('cors');
const amqp = require('amqplib/callback_api');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// redis connection
const redis = require('./redisConnect');
// mongo db setup
const mongo = require('mongodb').MongoClient;
const mongoUrl = 'mongodb://localhost:27017';

app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

io.on('connection', socket => {
  console.log(`User Socket Connected - ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`socket çalıştı`);
    console.log(`${socket.id} User disconnected.`);
  });
});

app.get('/get', (req, res) => {
  // redis çalışıyor ise redisten al
  if (redis.firstRedisClient.connected) {
    redis.firstRedisClient.get('stock', (error, rep) => {
      // rediste aranan data varsa sayfaya gönder.
      if (rep !== null) {
        res.send(rep);
      } else {
        // rediste yoksa mongo dbden datayı al ve sayfaya gönder.
        mongo.connect(
          mongoUrl,
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
          (err, client) => {
            const db = client.db('mylib');

            const collection = db.collection('persons');

            collection.findOne({productId: 123}, (err, item) => {
              redis.firstRedisClient.hmset('stock', {
                stock: item.stock,
              });
              res.send(item);
            });
          }
        );
      }
    });
  } else {
    mongo.connect(
      'mongodb://127.0.0.1:27017',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err, client) => {
        const db = client.db('mylib');

        const collection = db.collection('persons');
        collection.findOne({productId: 123}, (err, item) => {
          console.log('redise bağlanılamadı ve mongo dbden data alındı.');
          console.log('item', item);
          res.send(item);
        });
      }
    );
  }
});

app.post('/post', (req, res) => {
  // update mongodb
  try {
    mongo.connect(
      mongoUrl,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db('mylib');
        var myquery = {stock: 1};
        var newvalues = {$set: {stock: req.body.stock}};
        console.log('reqbodystockkkkkkkkkk', req.body.stock);
        dbo
          .collection('persons')
          .updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log('1 document updated');
            db.close();
          });
      }
    );
    // return res.status(200).json({status: 'succesfully update'});
  } catch (error) {
    res.status(500).send(error);
  }
  amqp.connect('amqp://localhost', (connError, connection) => {
    if (connError) {
      // console.log('conError: ', connError.test);
    }
    const payloadData = {
      stock: req.body.stock,
    };
    console.log('payloadData: ', payloadData);

    connection.createChannel((channelError, channel) => {
      if (channelError) {
        // throw channelError;
      }
      const Queue = 'person';

      try {
        // add queue
        // channel.assertQueue(Queue, {
        //   durable: false,
        // });

        // delete message from queue
        // channel.purgeQueue(Queue);

        // message send to queue
        channel.sendToQueue(Queue, Buffer.from(JSON.stringify(payloadData)));
      } catch (e) {
        console.log("rabbitmq'ya ekleme yapılırken bir hata oluştu.");
      } finally {
        channel.consume(
          Queue,
          data => {
            console.log('gelendata', data.content.toString());
            updateStock = data.content.toString();

            // socket.io ile bu kanalı dinleyen browserların dataları güncellendi.
            io.emit('updateStock', updateStock);

            // remote redis update
            if (redis.secondRedisClient.connected) {
              remoteRedisClient.set('stock', 5, () => {
                console.log('remote Redis update');
              });
            }

            // local redis update
            if (redis.firstRedisClient.connected) {
              redis.firstRedisClient.set('stock', 3, () => {
                console.log('local Redis update');
              });
            }
          },
          {
            noAck: true,
          }
        );
      }
    });
    res.send('ok');
  });
});

server.listen(3000, () => {
  console.log('Uygulama çalıştırıldı...');
});
