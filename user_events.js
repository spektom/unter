const r = require("rethinkdb");

/**
 * Pushes notification to a user using database.
 */
function push(dbConn, userId, info) {
  var event = info;
  event.userId = userId;
  r.table("user_events").insert(event).run(dbConn, function(err, res) {
    if (err) {
      console.log(`Can't push user event: ${err}`);
    }
  });
}

/**
 * Listen to all incoming events by user ID
 */
function readAll(dbConn, userId, callback) {
  // TODO: Implement reading just unread events:
  r.table("user_events").filter({"userId": userId}).changes().run(dbConn, function(err, cursor) {
    if (err) {
      callback(err, null);
    } else {
      cursor.each(function(err, row) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, row.new_val);
        }
      });
    }
  });
}

module.exports = {
  push: push,
  readAll: readAll
};

