const { v4: uuid } = require('uuid');

const photosData = [
  {
    authors: ['Adam'],
    id: uuid(),
    img: 'http://localhost:8000/_TW00073_Nik_DxO.jpg',
    title: 'Jeleń na rykowisku',
  },
  {
    authors: ['Grzegorz'],
    id: uuid(),
    img: 'http://localhost:8000/image.jpg',
    title: 'Tralala',
  },
];

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
    const { fileName, title, description, keywords, theme } = request.body;
    if (!fileName || !title || !description || !keywords || !theme) {
      response.status(400).json({
        message: 'Nie podano wszystkich wymaganych informacji',
      });

      return;
    }

    const isPhotoExist = photosData.some(({ title: currentTitle }) => currentTitle === title);
    if (isPhotoExist) {
      response.status(409).json({
        message: `Istnieje już w bazie zdjęcie o podantm tytule ${title}`,
      });

      return;
    }

    const newPhoto = {
      fileName,
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
    const { authors, id, title } = request.body;
    if (!authors || !id || !title) {
      response.status(400).json({
        message: 'Nie podano wszystkich wymaganych informacji',
      });

      return;
    }

    const indexPhotoToUpdate = photosData.findIndex(course => course.id === id);
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