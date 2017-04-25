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

### Installing dependencies

    yarn install 

### Running all services

    nodejs ./index.js

### Testing

Inspecting incoming user events for userId=1 (open in new window):

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

