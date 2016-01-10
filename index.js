var config = require('./conf/config.json'),
    validator = require('./lib/config-validator'),
    child_process = require('child_process'),
    cluster = [],
    express = require('express')();

express.get('/start', function (res, req) {
    validator.validate(config);

    config.checks.forEach(function (check) {
        var worker = child_process.fork(__dirname + '/lib/checker.js');
        check.alerts = config.alerts;
        worker.send(check);

        cluster.push(worker);
    });
    res.send('OK');
});

express.get('/stop', function (res, req) {
    /* stop application */
});

express.get('/status', function (res, req) {
    var list = {};
    cluster.forEach(function (worker) {
        worker.send('status');
        worker.on('message', function (instance) {
            list[instance.getConfig().id] = instance.getStatus().content;
        });
    });

    res.send(JSON.stringify(list));
});

express.listen(4321, '127.0.0.1', function () {
    console.log("... port %d in %s mode", 4321, express.settings.env);
});

