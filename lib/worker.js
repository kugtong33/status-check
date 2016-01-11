var Instance = require('./instance'),
    checker = require('./checker'),
    client = require('socket.io-client').connect('http://127.0.0.1:4321');

client.on('connect', function () {
    client.on('config', function (config) {

    });
});
