const r = require("rethinkdb");
require("rethinkdb-init")(r);

/**
 * Sets up database connection, create needed tables, and put some fake data inside
 */
function setup(callback) {
  console.log("Connecting to the database");
  r.init({
    host: "localhost",
    port: 28015,
    db: "unter"
  }, [
    "user_events",
    "ride_requests",
    {name: "drivers", indexes: [{name: "loc", geo: true}]},
  ]).then(function(conn) {
    require("./drivers").insertFakeData(conn, function(err, resp) {
      callback(err, conn);
    });
  }, function(err) {
    callback(err, null);
  });
}

module.exports = {
  setup: setup
};

