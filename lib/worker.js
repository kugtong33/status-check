var Instance = require('./instance').Instance,
    checker = require('./checker'),
    client = require('socket.io-client').connect('http://127.0.0.1:4321'),
    instance;

client.on('connect', function () {
    client.on('status', function () {
        client.emit(instance);
    });
});

process.on('message', function (config) {
    console.log(config);
    instance = new Instance(config);
    if (config.type === 'http') {
        checker.http(instance);
    } else if (config.type === 'ping') {
        checker.ping(instance);
    }
});