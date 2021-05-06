const { v4: uuid } = require("uuid");
const fs = require("fs");

const { photosData } = require("./photos");

const themesData = [];

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
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie PUT w endpointcie /themes",
    });
  }
};
