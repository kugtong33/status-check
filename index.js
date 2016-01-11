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
    sockets.push(socket);
});

config.checks.forEach(function (check) {
    var worker = child_process.fork(__dirname + '/lib/worker.js');
    check.alerts = config.alerts;
    worker.send(check);
    cluster.push(worker);
});