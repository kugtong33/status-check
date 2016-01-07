var config = require('./conf/config.json'),
    child_process = require('child_process');

/*
 * TODO
 * - Make checks global for easy instance monitoring
 * - Make alerts global for easy access
 * - Add Alert Object for email capabilities
 * - Add on exit event for clean exit when exiting this process
 * - Fix config data checker
 * /


 /* Incomplete config checker function */
(function check(config) {
    var defaults = {
        config: {
            alerts: []
        },
        checks: {
            responseTimeout: 10,
            checkInterval: 60,
            unhealthyThreshold: 2,
            healthyThreshold: 5
        },
        http: {
            port: 80,
            path: '/ping'
        },
        alerts: {
            checks: '.+',
            statuses: ['unhealthy', 'healthy']
        },
    }, required = {
        config: [],
        checks: [],
        alerts: []
    };

    /* Check config data for defaults and require values */
})(config);

config.checks.forEach(function (instance) {
    var worker = child_process.fork(__dirname + '/lib/checker.js');
    worker.send(instance);
});