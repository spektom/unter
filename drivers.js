const r = require("rethinkdb");
const user_events = require("./user_events");

// For tests try changing the value to:
//  - 10 (all drivers accept the ride)
//  - 7 (no driver accepts the ride)
const NEARBY_RANGE_KM = 8;

function insertFakeData(dbConn, callback) {
  r.table("drivers").isEmpty().run(dbConn, function(err, empty) {
    if (err) {
      callback(err, null);
    } else if (empty) {
      r.table("drivers").insert([
        {name: "Tamar",   loc: r.point(31.1832, 34.1212)},
        {name: "Avigail", loc: r.point(31.1831, 34.1288)},
        {name: "Adele",   loc: r.point(31.1834, 34.1271)},
        {name: "Noa",     loc: r.point(31.1846, 34.1232)},
        {name: "Shira",   loc: r.point(31.1855, 34.1283)},
        {name: "Talia",   loc: r.point(31.1832, 34.1272)},
        {name: "Yael",    loc: r.point(31.1856, 34.1278)},
        {name: "Sarah",   loc: r.point(31.1870, 34.1245)},
        {name: "Leah",    loc: r.point(31.1852, 34.1239)},
        {name: "Roni",    loc: r.point(31.1865, 34.1288)}
      ]).run(dbConn, callback);
    } else {
      callback(null, true);
    }
  });
}

function findNearest(dbConn, latitude, longitude, distInKm, callback) {
  r.table("drivers").getNearest(
    r.point(latitude, longitude),
    {
      index: "loc",
      maxDist: distInKm,
      unit: "km",
      geoSystem: "WGS84"
    }
  ).run(dbConn, callback);
}

function acceptRideRequest(dbConn, requestId, driverInfo, callback) {
  console.log(`${driverInfo.doc.name} (distance: ${driverInfo.dist} km) has accepted the ride request ${requestId}`);
  // Push driver info into ride request atomically:
  r.table("ride_requests").get(requestId).update({
    accepts: r.row("accepts").append(driverInfo)
  }).run(dbConn, callback);
}

function createRideRequest(dbConn, request, callback) {
  // TODO: handle the case when ride was already requested by the user
  request.created = new Date().getTime();
  request.accepts = []; // this will hold all the accept driver responses
  r.table("ride_requests").insert(request).run(dbConn, function(err, res) {
    if (err) {
      callback(err, null);
    } else {
      request.id = res.generated_keys[0];
      console.log(`Created new ride request: ${request.id}`);
      notifyNearbyDrivers(dbConn, request);
      waitForAccepts(dbConn, 3, 10000, request);
      callback(null, request);
    }
  });
}

/**
 * The following function select the closest driver from the list of drivers,
 * which accepted the ride, and notify the user.
 */
function selectDriver(dbConn, request, driverInfos) {
  const driverInfo = driverInfos.reduce(function (p, v) {
    return p.dist < v.dist ? p : v;
  });
  console.log(`Selected driver ${driverInfo.doc.name} with distance: ${driverInfo.dist} km`);

  user_events.push(dbConn, request.userId, {
    status: "RIDE_ACCEPTED",
    driver: driverInfo
  });
}

/**
 * Notifies user that no driver has accepted the ride
 */
function notifyDriverNotFound(dbConn, request) {
  console.log("No driver was found in around");
  user_events.push(dbConn, request.userId, {
    status: "RIDE_NOT_ACCEPTED"
  });
}

function fetchAccepts(dbConn, requestId, callback) {
  r.table("ride_requests").get(requestId).run(dbConn, function(err, resp) {
    if (err) {
      // TODO: handle error
      console.log(err);
    } else {
      callback(resp.accepts);
    }
  });
}

/**
 * The following function waits until one of the following happens:
 *  - minAccepts drivers accept the ride
 *  - time specified by timeoutSec passes
 */
function waitForAccepts(dbConn, minAccepts, timeoutMillis, request) {
  console.log("Waiting for drivers to accept the ride");
  var globalTimeout;

  // TODO: for some reason changefeed functionality doesn't work for sub-arrays,
  // so we're setting up a regular polling strategy:
  var checkInterval = setInterval(function() {
    fetchAccepts(dbConn, request.id, function(accepts) {
      if (accepts.length >= minAccepts) {
        clearTimeout(globalTimeout);
        clearInterval(checkInterval);
        selectDriver(dbConn, request, accepts);
      }
    });
  }, 1000);

  globalTimeout = setTimeout(function() {
    clearInterval(checkInterval);
    fetchAccepts(dbConn, request.id, function(accepts) {
      if (accepts.length > 0) {
        selectDriver(dbConn, request, accepts);
      } else {
        notifyDriverNotFound(dbConn, request);
      }
    });
  }, timeoutMillis);
}

function notifyNearbyDrivers(dbConn, request) {
  findNearest(dbConn, request.fromLoc[0], request.fromLoc[1], NEARBY_RANGE_KM, function(err, drivers) {
    // TODO: the following code emulates all drivers accepting ride request after some time:
    setTimeout(function() {
      drivers.forEach(function(driver) {
        acceptRideRequest(dbConn, request.id, driver);
      });
    }, 3000);
  });
}

module.exports = {
  insertFakeData: insertFakeData,
  createRideRequest: createRideRequest
};

