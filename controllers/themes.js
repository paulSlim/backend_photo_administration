const { v4: uuid } = require("uuid");
const fs = require("fs");
const { getDataFromJson } = require("../photoReadWriteDataController");
const { writeDataToJson } = require("../photoReadWriteDataController");

const jsonPath = "./theme-data.json";

const { photosData } = require("./photos");

const themesData = getDataFromJson(jsonPath);

exports.getThemes = (request, response, next) => {
  try {
    response.status(200).json({
      themes: themesData,
    });
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie GET w endpointcie /themes",
    });
  }
};

exports.postTheme = (request, response, next) => {
  try {
    const { themeName } = request.body;
    if (!themeName) {
      response.status(400).json({
        message: "Nie podano nazwy tematu",
      });

      return;
    }

    const isThemeExist = themesData.some(
      ({ themeName: currentName }) => currentName === themeName
    );
    if (isThemeExist) {
      response.status(409).json({
        message: `Istnieje już w bazie temat o podanym tytule ${themeName}`,
      });

      return;
    }

    const newTheme = {
      themeName,
      id: uuid(),
    };

    themesData.push(newTheme);

    response.status(201).json({
      themes: themesData,
    });
    writeDataToJson(jsonPath, themesData);
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie POST w endpointcie /themes",
    });
  }
};

exports.putTheme = (request, response, next) => {
  try {
    const { id, oldThemeName, themeName } = request.body;
    console.log(id);
    console.log(themeName);
    if (!id || !oldThemeName || !themeName) {
      response.status(400).json({
        message: "Nie podano wszystkich wymaganych informacji",
      });

      return;
    }

    const indexThemeToUpdate = themesData.findIndex((theme) => theme.id === id);
    if (indexThemeToUpdate === -1) {
      response.status(404).json({
        message: "Nie znaleziono tematu o podanym id",
      });

      return;
    }

    photosData.forEach((photo) => {
      if (photo.theme === oldThemeName) {
        photo.theme = themeName;
      }
    });

    themesData.splice(indexThemeToUpdate, 1, request.body);

    response.status(202).json({
      themes: themesData,
    });
    writeDataToJson(jsonPath, themesData);
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie PUT w endpointcie /themes",
    });
  }
};

exports.deleteTheme = (request, response, next) => {
  try {
    const { id } = request.params;

    console.log(id);
    const indexThemeToDelete = themesData.findIndex((theme) => theme.id === id);

    if (indexThemeToDelete === -1) {
      response.status(404).json({
        message: "Nie znaleziono tematu o podanym id",
      });

      return;
    }

    const themeName = themesData[indexThemeToDelete].themeName;

    photosData.forEach((photo) => {
      if (photo.theme === themeName) {
        photo.theme = "";
      }
    });

    themesData.splice(indexThemeToDelete, 1);

    response.status(200).end();
    writeDataToJson(jsonPath, themesData);
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie DELETE w endpointcie /themes/:id",
    });
  }
};

exports.themesData = themesData;
