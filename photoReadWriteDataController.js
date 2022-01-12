const fs = require("fs");

const getDataFromJson = (path) => {
  try {
    const data = fs.readFileSync(path, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`);
  }
};

const writeDataToJson = (path, data) => {
  const dataToWrite = JSON.stringify(data);

  fs.writeFile(path, dataToWrite, "utf8", (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`File is written successfully!`);
    }
  });
};

exports.getDataFromJson = getDataFromJson;
exports.writeDataToJson = writeDataToJson;
