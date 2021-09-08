const { photosData } = require("./photos");

exports.movePhoto = (request, response, next) => {
  try {
    const {
      id,
      fileAddress,
      title,
      description,
      keywords,
      theme,
      neighbourId,
      direction,
    } = request.body;

    const indexPhotoToMove = photosData.findIndex((photo) => photo.id === id);
    console.log("indexPhotoToMove", indexPhotoToMove);

    if (indexPhotoToMove === -1) {
      response.status(404).json({
        message: "Nie znaleziono zdjęcia o podanym id indexPhotoToMove",
      });

      return;
    }

    const photoToMove = {
      fileAddress,
      id,
      title,
      description,
      keywords,
      theme,
    };

    if (direction === "prepend") {
      photosData.splice(indexPhotoToMove, 1);
      const indexPhotoNeighbour = photosData.findIndex(
        (photo) => photo.id === neighbourId
      );
      console.log("indexPhotoNeighbour", indexPhotoNeighbour);
      if (indexPhotoNeighbour === -1) {
        response.status(404).json({
          message: "Nie znaleziono zdjęcia o podanym id",
        });

        return;
      }
      photosData.splice(indexPhotoNeighbour, 0, photoToMove);
    }

    if (direction === "append") {
      photosData.splice(indexPhotoToMove, 1);
      const indexPhotoNeighbour = photosData.findIndex(
        (photo) => photo.id === neighbourId
      );
      console.log("indexPhotoNeighbour", indexPhotoNeighbour);
      if (indexPhotoNeighbour === -1) {
        response.status(404).json({
          message: "Nie znaleziono zdjęcia o podanym id",
        });

        return;
      }
      photosData.splice([indexPhotoNeighbour + 1], 0, photoToMove);
    }

    response.status(200).end();
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie MOVE w endpointcie /photos",
    });
  }
};
