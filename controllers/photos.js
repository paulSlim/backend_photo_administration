const { v4: uuid } = require("uuid");
const fs = require("fs");
const { request } = require("http");

const photosData = [
  {
    fileAddress: "brama.jpg",
    id: "af8188e0-a709-4fff-94d3-128113bdf6b2",
    title: "Brama",
    description: "1",
    keywords: ["Brama"],
    theme: "test1",
  },
  {
    fileAddress: "Cieplice.jpg",
    id: "aa0b80b2-9d15-4298-bac3-9ba108ddc327",
    title: "Cieplice",
    description: "2",
    keywords: ["Ceplice"],
    theme: "test2",
  },
  {
    fileAddress: "Gaja 50x70.jpg",
    id: "02b52ed6-7caf-407a-a774-1e4420510665",
    title: "Gaja",
    description: "3",
    keywords: ["Gaja"],
    theme: "test3",
  },
  {
    fileAddress: "nuthatch.jpg",
    id: "b18936a7-5e71-48f7-a8eb-9eae71a5e572",
    title: "Ptak",
    description: "4",
    keywords: ["Ptak"],
    theme: "test1",
  },
  {
    fileAddress: "Poczta.jpg",
    id: "a553bcc0-cc78-4e54-876a-227323152797",
    title: "Poczta",
    description: "5",
    keywords: ["Poczta"],
    theme: "test2",
  },
  {
    fileAddress: "Walkiria.jpg",
    id: "64bcc249-cd80-4567-bf48-6963bf55c052",
    title: "Walkiria",
    description: "6",
    keywords: ["Walkiria"],
    theme: "test3",
  },
];

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
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie PUT w endpointcie /photos",
    });
  }
};

exports.deletePhoto = (request, response, next) => {
  try {
    const { id } = request.params;

    console.log(id);
    const indexPhotoToDelete = photosData.findIndex((photo) => photo.id === id);

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

    response.status(200).end();
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie DELETE w endpointcie /photos/:id",
    });
  }
};

exports.photosData = photosData;
