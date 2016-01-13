var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    alert = require('./alert');

var Instance = function (config) {

    EventEmitter.call(this);
    var _this = this,
        status = {
            content: 'unknown'
        },
        threshold = {
            healthy: 0,
            unhealthy: 0
        },
        _config = config;


    Object.observe(status, function (change) {
        threshold.healthy = 0;
        threshold.unhealthy = 0;

        config.status = status;
        alert.send(config);
    });

    this.notify = function (notification) {
        _this.emit('status');
        if (notification != status.content) {
            if (notification == 'healthy') {
                threshold.healthy++;
            } else if (notification == 'unhealthy') {
                threshold.unhealthy++;
            }

            if (threshold.healthy == config.healthyThreshold) {
                status.content = 'healthy';
            } else if (threshold.unhealthy == config.unhealthyThreshold) {
                status.content = 'unhealthy';
            }
        }
    };

    this.setStatus = function (newStatus) {
        status = newStatus;
    };

    this.getStatus = function () {
        return status;
    };

    this.getThreshold = function () {
        return threshold;
    };

    this.getConfig = function () {
        return _config;
    };
};
util.inherits(Instance, EventEmitter);

exports.Instance = Instance;
