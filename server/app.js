const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path');
const cors = require('cors');
const { isDev } = require('./config');
if (isDev) require('dotenv').config();
const app = express();

// middlewares 
app.use(cors());
app.use(bodyParser.json());

app.use('/test', (req, res) => {
  console.log('test route is visited.');
  res.send('server is running...');
});

// // serve react project static files
// app.use('/', express.static('client/build'));
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')));

// server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, err => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Your server is ready.. PORT: ${PORT}`);
});

// socket io
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
  maxHttpBufferSize: 1e6,
});
const socketHandler = require('./socket');
io.on('connection', socketHandler(io));
