var config = require('./conf/config.json'),
    validator = require('./lib/validator'),
    child_process = require('child_process'),
    cluster = [],
    server = require('socket.io')(4321),
    report = {};

validator.validate(config);

server.on('connection', function (socket) {
    socket.on('status', function (instance) {
        report[instance.id] = instance.status;
    });

    socket.on('report', function () {
        socket.emit('report', report);
    });
});

config.checks.forEach(function (check) {
    var worker = child_process.fork(__dirname + '/lib/worker.js');
    check.alerts = config.alerts;
    worker.send(check);
    cluster.push(worker);
});

process.on('SIGTERM', function () {
    cluster.forEach(function (worker) {
        worker.kill('SIGINT');
    });
    server.close();
    process.exit(0);
});