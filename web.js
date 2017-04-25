const express = require("express");
const path = require("path");

function start(init) {
  const port = process.env.PORT || 3000;
  console.log(`Starting the Web service on port ${port}`);
  const app = express();
  init(app);
  app.listen(port);
};

module.exports = {
  start: start
};

