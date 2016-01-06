var config = require('./conf/config.json'),
    checker = require('./lib/checker');


config.checks.forEach(function (instance) {
    checker.ping(instance);
});
