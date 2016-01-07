var config = require('./conf/config.json'),
    child_process = require('child_process');

config.checks.forEach(function (instance) {
    var worker = child_process.fork(__dirname + '/lib/checker.js');
    worker.send(instance);
});

