var Instance = require('./instance').Instance,
    checker = require('./checker'),
    client = require('socket.io-client').connect('http://127.0.0.1:4321'),
    instance;

process.on('message', function (config) {
    instance = new Instance(config);

    instance.on('status', function () {
        client.emit('status', {
            id: instance.getConfig().id,
            status: instance.getStatus().content
        });
    });

    if (config.type === 'http') {
        checker.http(instance);
    } else if (config.type === 'ping') {
        checker.ping(instance);
    }

    instance.emit('status');
});

process.on('SIGINT', function () {
    process.exit(0);
});