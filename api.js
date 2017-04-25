const db = require("./db");
const drivers = require("./drivers");

function initEndpoints(app, dbConn) {
  app.use(require("body-parser").json())

  app.post("/api/rideRequest", function(req, r) {
    var json = req.body;
    // TODO: extract userId from the request
    json.userId = 1;
    drivers.createRideRequest(dbConn, json, function(err, rideRequest) {
      if (err) {
        r.status(500).send({error: err});
      } else {
        r.status(200).send(rideRequest);
      }
    });
  });
}

module.exports = {
  init: initEndpoints
};

