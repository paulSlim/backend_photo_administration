const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const photosRoutes = require('./routes/photos');
const usersRoutes = require('./routes/users');

const server = express();

server.use(bodyParser.json());
server.use(cors());

server.use('/photos', photosRoutes);
server.use('/users', usersRoutes);
server.use(express.static('uploaded')); // serve files


server.listen(8000, () => console.log('Server for photos is started...'));
