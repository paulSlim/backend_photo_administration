const { v4: uuid } = require("uuid");
const fs = require("fs");
const { request } = require("http");
const { getDataFromJson } = require("../photoReadWriteDataController");
const { writeDataToJson } = require("../photoReadWriteDataController");

const jsonPath = "./photo-data.json";

const photosData = getDataFromJson(jsonPath);
//   {
//     fileAddress: "brama.jpg",
//     id: "af8188e0-a709-4fff-94d3-128113bdf6b2",
//     title: "Brama",
//     description: "1",
//     keywords: ["Brama"],
//     theme: "test1",
//   },
//   {
//     fileAddress: "Cieplice.jpg",
//     id: "aa0b80b2-9d15-4298-bac3-9ba108ddc327",
//     title: "Cieplice",
//     description: "2",
//     keywords: ["Ceplice"],
//     theme: "test2",
//   },
//   {
//     fileAddress: "Walkiria.jpg",
//     id: "64bcc249-cd80-4567-bf48-6963bf55c052",
//     title: "Walkiria",
//     description: "6",
//     keywords: ["Walkiria"],
//     theme: "test3",
//   },
// ];

exports.getPhotos = (request, response, next) => {
  try {
    response.status(200).json({
      photos: photosData,
    });
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie GET w endpointcie /photos",
    });
  }
};

exports.postPhoto = (request, response, next) => {
  try {
    const { fileAddress, title, description, keywords, theme } = request.body;
    if (!fileAddress || !title || !description || !keywords || !theme) {
      response.status(400).json({
        message: "Nie podano wszystkich wymaganych informacji",
      });

      return;
    }

    const isPhotoExist = photosData.some(
      ({ title: currentTitle }) => currentTitle === title
    );
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
      theme,
    };

    photosData.push(newPhoto);

    response.status(201).json({
      photos: photosData,
    });
    writeDataToJson(jsonPath, photosData);
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie POST w endpointcie /photos",
    });
  }
};

exports.putPhoto = (request, response, next) => {
  try {
    const { id, fileAddress, title, description, keywords, theme } =
      request.body;
    if (!id || !fileAddress || !title || !description || !keywords || !theme) {
      response.status(400).json({
        message: "Nie podano wszystkich wymaganych informacji",
      });

      return;
    }

    const indexPhotoToUpdate = photosData.findIndex((photo) => photo.id === id);
    if (indexPhotoToUpdate === -1) {
      response.status(404).json({
        message: "Nie znaleziono zdjęcia o podanym id",
      });

      return;
    }

    photosData.splice(indexPhotoToUpdate, 1, request.body);

    response.status(202).json({
      photos: photosData,
    });
    writeDataToJson(jsonPath, photosData);
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie PUT w endpointcie /photos",
    });
  }
};

exports.patchPhoto = (request, response, next) => {
  try {
    const { selectedPhotoIds, keywords, theme } = request.body;
    if (!selectedPhotoIds) {
      response.status(400).json({
        message: "Lista przesłanych zdjęć do edycji jest pusta",
      });

      return;
    }

    selectedPhotoIds.forEach((id) => {
      const indexPhotoToUpdate = photosData.findIndex(
        (photo) => photo.id === id.id
      );
      const currentPhoto = photosData[indexPhotoToUpdate];

      const photoKeywords = currentPhoto.keywords;

      if (keywords.length > 0) {
        const keywordsToAdd = keywords.filter(
          (keyword) => keyword !== photoKeywords
        );

        const testKeywords = [...photoKeywords, ...keywordsToAdd];
        currentPhoto.keywords = testKeywords;
        console.log(currentPhoto.keywords);
      }

      if (theme) {
        currentPhoto.theme = theme;
      }
    });

    response.status(202).json({
      photos: photosData,
    });
    writeDataToJson(jsonPath, photosData);
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie PATCH w endpointcie /photos",
    });
  }
};

exports.deletePhoto = (request, response, next) => {
  try {
    const { ...photosIds } = request.body;

    Object.values(photosIds).forEach((photoId) => {
      console.log(photoId);
      const indexPhotoToDelete = photosData.findIndex(
        (photo) => photo.id === photoId.id
      );

      if (indexPhotoToDelete === -1) {
        response.status(404).json({
          message: "Nie znaleziono zdjęcia o podanym id",
        });

        return;
      }

      const path = `./uploaded/${photosData[indexPhotoToDelete].fileAddress}`;

      fs.unlink(path, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
      photosData.splice(indexPhotoToDelete, 1);
    });
    response.status(200).end();
    writeDataToJson(jsonPath, photosData);
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie DELETE w endpointcie /photos",
    });
  }
};

exports.photosData = photosData;
