unter
======

Uber-like service :)

## Modules

 * index.js        : Main entry point
 * db.js           : Interaction with the storage
 * drivers.js      : Basic functionality
 * web.js          : Web service
 * api.js          : REST API service endpoints
 * ws.js           : Websocket endpoints
 * user\_events.js : User events queue

## Running

### Dependencies

 * [Yarn](https://yarnpkg.com) >= v0.21.3
 * [Node.js](https://nodejs.org) >= v7.6.0
 * [RethinkDB](https://rethinkdb.com) - see below how to run it using Docker.

### Installing dependencies

    yarn install 
    
### Running RethinkDB as Docker container

    docker run --name rethink -p 28015:28015 -p 8080:8080 -d rethinkdb

### Running all services

    nodejs ./index.js

### Testing

Inspecting incoming user events (for userId=1, which is currently hard-coded):

    curl -i -N -H "Connection: Upgrade" \
      -H "Upgrade: websocket" \
      -H "Host: 127.0.0.1:3000" \
      -H "Origin: http://127.0.0.1:3000" \
      -H "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
      -H "Sec-WebSocket-Version: 13" \
      http://127.0.0.1:3000/ws/userEvents/1

Creating a ride request:

    curl -X POST \
      http://127.0.0.1:3000/api/rideRequest \
      -H 'content-type: application/json' \
      -d '{"fromLoc": [31.100, 34.105], "toLoc": [31.1563, 35.472]}'

#### Samples

Setting `NEARBY_RANGE_KM` to 7:

    michael@gibraltar:~/unter$ nodejs ./index.js 
    Connecting to the database
    Starting the Web service on port 3000
    Created new ride request: 9768f1c9-9d11-47c4-808d-58d4b60b707a
    Waiting for drivers to accept the ride
    No driver was found in around

Setting `NEARBY_RANGE_KM` to 8:

    michael@gibraltar:~/unter$ nodejs ./index.js 
    Connecting to the database
    Starting the Web service on port 3000
    Created new ride request: c63c9106-2949-42f7-bfd2-fe91eee33347
    Waiting for drivers to accept the ride
    Tamar (distance: 7.883739748126085 km) has accepted the ride request c63c9106-2949-42f7-bfd2-fe91eee33347
    Selected driver Tamar with distance: 7.883739748126085 km

Setting `NEARBY_RANGE_KM` to 10:

    michael@gibraltar:~/unter$ nodejs ./index.js 
    Connecting to the database
    Starting the Web service on port 3000
    Created new ride request: b4115401-43c4-419c-bc17-a85a8b6705dd
    Waiting for drivers to accept the ride
    Tamar (distance: 7.883739748126085 km) has accepted the ride request b4115401-43c4-419c-bc17-a85a8b6705dd
    Talia (distance: 8.061271070245528 km) has accepted the ride request b4115401-43c4-419c-bc17-a85a8b6705dd
    Noa (distance: 8.062143729700015 km) has accepted the ride request b4115401-43c4-419c-bc17-a85a8b6705dd
    Adele (distance: 8.075472933001388 km) has accepted the ride request b4115401-43c4-419c-bc17-a85a8b6705dd
    Avigail (distance: 8.108454134375974 km) has accepted the ride request b4115401-43c4-419c-bc17-a85a8b6705dd
    Leah (distance: 8.135379965330696 km) has accepted the ride request b4115401-43c4-419c-bc17-a85a8b6705dd
    Yael (distance: 8.292413873510437 km) has accepted the ride request b4115401-43c4-419c-bc17-a85a8b6705dd
    Shira (distance: 8.300707239984042 km) has accepted the ride request b4115401-43c4-419c-bc17-a85a8b6705dd
    Sarah (distance: 8.312991805869244 km) has accepted the ride request b4115401-43c4-419c-bc17-a85a8b6705dd
    Roni (distance: 8.405660332425976 km) has accepted the ride request b4115401-43c4-419c-bc17-a85a8b6705dd
    Selected driver Tamar with distance: 7.883739748126085 km
