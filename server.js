const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const photosRoutes = require('./routes/photos');
const usersRoutes = require('./routes/users');

const server = express();

server.use(bodyParser.json());
server.use(cors());

server.use('/photos', photosRoutes);
server.use('/users', usersRoutes);
server.use(express.static('uploaded')); // serve files

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'uploaded')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname )
  }
});

const upload = multer({ storage: storage }).single('file');

server.post('/upload',function(req, res) {
     
    upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.status(500).json(err)
           } else if (err) {
               return res.status(500).json(err)
           }
      return res.status(200).send(req.file)

    })

});


server.listen(8000, () => console.log('Server for photos is started...'));
