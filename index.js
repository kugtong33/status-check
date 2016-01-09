var config = require('./conf/config.json'),
    validator = require('./lib/config-validator'),
    child_process = require('child_process');

/*
 * TODO
 * - Make checks global for easy instance monitoring
 * - Make alerts global for easy access
 * - Add Alert Object for email capabilities
 * - Add on exit event for clean exit when exiting this process
 * - Fix config data checker
 *
 *
 * A Testing Framework (Mocha, Vows, Intern)
 * An Assertion Library (Chai, Assert)
 * Stubs (Sinon)
 * Module Control (Mockery, Rewire)
 *
 * http://fredkschott.com/post/2014/05/nodejs-testing-essentials/
 *
 * /


 /* validate config */
validator.validate(config);

config.checks.forEach(function (check) {
    var worker = child_process.fork(__dirname + '/lib/checker.js');
    check.alerts = config.alerts;
    worker.send(check);
});