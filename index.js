const db = require("./db");
const web = require("./web");
const api = require("./api");
const websocket = require("./ws");

db.setup(function(err, dbConn) {
  if (err) throw err;
  web.start(function(app) {
    api.init(app, dbConn);
    websocket.init(app, dbConn);
  });
});
