var config = require('./conf/config.json'),
    validator = require('./lib/config-validator'),
    child_process = require('child_process'),
    cluster = [],
    sockets = [],
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
        sockets.forEach(function (socket) {
            socket.emit('status');
        });
        console.log(report);
        socket.emit('status', report);
        report = [];
    });
});

function exit() {
    cluster.forEach(function (worker) {
        worker.kill('SIGINT');
    });

    server.close();
    status.close();

    process.exit(0);
}

process.on('SIGTERM', exit);