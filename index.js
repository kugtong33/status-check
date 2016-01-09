var config = require('./conf/config.json'),
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


 /* Incomplete config checker function */
(function check(config) {


    /* Check config data for required values */

})(config);

console.log(config);

//config.checks.forEach(function (instance) {
//    var worker = child_process.fork(__dirname + '/lib/checker.js');
//    worker.send(instance);
//});