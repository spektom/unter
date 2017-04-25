const user_events = require("./user_events");

function initEndpoints(app, dbConn) {
  require("express-ws")(app);
  app.ws("/ws/userEvents/:userId", function(ws, req) {
    console.log(`Accepted Websocket connection from user ${req.params.userId}`);
    user_events.readAll(dbConn, parseInt(req.params.userId), function(err, event) {
      if (event) {
        ws.send(JSON.stringify(event));
      }
    });
  });
}

module.exports = {
  init: initEndpoints
};

