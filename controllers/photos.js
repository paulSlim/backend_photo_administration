const { v4: uuid } = require('uuid');
const fs = require('fs');

const photosData = [];

exports.getPhotos = (request, response, next) => {
  try {
    response.status(200).json({
      photos: photosData
    });
  } catch (error) {
    response.status(500).json({
      error,
      message: 'Oops! Coś poszło nie tak, przy metodzie GET w endpointcie /photos',
    });
  }
};

exports.getPhoto = (request, response, next) => {
  try {
    const { id } = request.params;
    const photoToSend = photosData.find(photo => photo.id === id);

    if (!photoToSend) {
      response.status(404).json({
        message: 'Nie znaleziono zdjęcia o podanym id',
      });

      return;
    }

    response.status(200).json({
      photos: photoToSend,
    });
  } catch (error) {
    response.status(500).json({
      error,
      message: 'Oops! Coś poszło nie tak, przy metodzie GET w endpointcie /photos/:id',
    })
  }
};



exports.postPhoto = (request, response, next) => {
  try {
    const { fileAddress, title, description, keywords, theme } = request.body;
    if (!fileAddress || !title || !description || !keywords || !theme) {
      response.status(400).json({
        message: 'Nie podano wszystkich wymaganych informacji',
      });

      return;
    }

    const isPhotoExist = photosData.some(({ title: currentTitle }) => currentTitle === title);
    if (isPhotoExist) {
      response.status(409).json({
        message: `Istnieje już w bazie zdjęcie o podanym tytule ${title}`,
      });

      return;
    }

    const newPhoto = {
      fileAddress,
      id: uuid(),
      title,
      description,
      keywords,
      theme
    };

    photosData.push(newPhoto);

    response.status(201).json({
      photos: photosData
    });
  } catch (error) {
    response.status(500).json({
      error,
      message: 'Oops! Coś poszło nie tak, przy metodzie POST w endpointcie /photos'
    });
  }
};

exports.putPhoto = (request, response, next) => {
  try {
    const { id, fileAddress, title, description, keywords, theme } = request.body;
    if (!id || !fileAddress || !title || !description || !keywords || !theme) {
      response.status(400).json({
        message: 'Nie podano wszystkich wymaganych informacji',
      });

      return;
    }

    const indexPhotoToUpdate = photosData.findIndex(photo => photo.id === id);
    if (indexPhotoToUpdate === -1) {
      response.status(404).json({
        message: 'Nie znaleziono zdjęcia o podanym id',
      });

      return;
    }


    photosData.splice(indexPhotoToUpdate, 1, request.body);

    response.status(202).json({
      photos: photosData,
    });
  } catch (error) {
    response.status(500).json({
      error,
      message: 'Oops! Coś poszło nie tak, przy metodzie PUT w endpointcie /photos'
    });
  }
};

exports.deletePhoto = (request, response, next) => {
  try {
    const { id } = request.params;

    console.log(id);
    const indexPhotoToDelete = photosData.findIndex(photo => photo.id === id);

    if (indexPhotoToDelete === -1) {
      response.status(404).json({
        message: 'Nie znaleziono zdjęcia o podanym id',
      });

      return;
    }

    const path = `./uploaded/${photosData[indexPhotoToDelete].fileAddress}`;

    fs.unlink(path, (err) => {
      if (err) {
        console.error(err)
        return
      }
    })
    photosData.splice(indexPhotoToDelete, 1);

    response.status(200).end();
  } catch (error) {
    response.status(500).json({
      error,
      message: 'Oops! Coś poszło nie tak, przy metodzie DELETE w endpointcie /photos/:id',
    });
  }
};

exports.photosData = photosData;