const { v4: uuid } = require('uuid');
const fs = require('fs');

const themesData = ['pierwszy_temat', 'drugi_temat'];

exports.getThemes = (request, response, next) => {
  try {
    response.status(200).json({
      themes: themesData
    });
  } catch (error) {
    response.status(500).json({
      error,
      message: 'Oops! Coś poszło nie tak, przy metodzie GET w endpointcie /themes',
    });
  }
};

exports.postTheme = (request, response, next) => {
    try {
      const { themeName } = request.body;
      if (!themeName) {
        response.status(400).json({
          message: 'Nie podano nazwy tematu',
        });
  
        return;
      }
  
      const isThemeExist = themesData.some(({ themeName: currentName }) => currentName === title);
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
  
      photosData.push(newTheme);
  
      response.status(201).json({
        themes: themesData
      });
    } catch (error) {
      response.status(500).json({
        error,
        message: 'Oops! Coś poszło nie tak, przy metodzie POST w endpointcie /themes'
      });
    }
  };