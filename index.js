var config = require('./conf/config.json'),
    validator = require('./lib/config-validator'),
    child_process = require('child_process'),
    cluster = [],
    sockets = [],
    express = require('express')(),
    async = require('async'),
    server = require('socket.io')(4321);

validator.validate(config);

server.on('connection', function (socket) {
    socket.emit('config', cluster);
    sockets.push(socket);
});

config.checks.forEach(function (check) {
    cluster.push({
        config: check,
        worker: child_process.fork(__dirname + '/lib/worker.js')
    });
});

setTimeout(function () {
    sockets.forEach(function (socket, index) {
        socket.emit('config', cluster[index].config);
    });
}, 3000);





