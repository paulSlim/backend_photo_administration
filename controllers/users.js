const { photosData } = require("./photos");

const usersData = [
  {
    accessLevel: 0,
    login: "User",
    password: "12345",
  },
  {
    accessLevel: 1,
    login: "Admin",
    password: "******",
  },
];

exports.postUser = (request, response, next) => {
  try {
    const { login, password } = request.body;

    const user = usersData.find((u) => u.login === login);
    if (!user) {
      response.status(404).json({
        message: "Użytkownik o podanym loginie nie istnieje",
      });

      return;
    }

    const isPasswordCorrect = user.password === password;
    if (!isPasswordCorrect) {
      response.status(401).json({
        message: "Hasło lub login się nie zgadza",
      });

      return;
    }

    response.status(200).json({
      user,
    });
  } catch (error) {
    response.status(500).json({
      error,
      message:
        "Oops! Coś poszło nie tak, przy metodzie POST w endpointcie /users",
    });
  }
};
