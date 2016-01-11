var config = require('./conf/config.json'),
    validator = require('./lib/config-validator'),
    child_process = require('child_process'),
    cluster = [],
    sockets = [],
    async = require('async'),
    server = require('socket.io')(4321),
    status = require('socket.io')(4322),
    report = [];

validator.validate(config);

server.on('connection', function (socket) {
    socket.on('status', function (status) {
        report.push(status);
    });
    sockets.push(socket);
});

config.checks.forEach(function (check) {
    var worker = child_process.fork(__dirname + '/lib/worker.js');
    check.alerts = config.alerts;
    worker.send(check);
    cluster.push(worker);
});

status.on('connection', function (socket) {
    socket.on('status', function () {
        async.eachSeries(sockets, function (socket, callback) {
            socket.emit('status');
            callback();
        }, function (err) {
            if (err) {
                throw err;
            } else {
                socket.emit('status', report);
                report = [];
            }
        });
    });
});