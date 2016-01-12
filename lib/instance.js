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
        _this.emit('change', status);
    });

    _this.on('change', function (status) {
        config.status = this.getStatus();
        alert.send(config, function (error, info) {
            if (error) {
                console.log(error);
            }
        });
    });

    this.notify = function (notification) {
        if (notification != status.content) {
            if (notification == 'healthy') {
                threshold.healthy++;
            } else if (notification == 'unhealthy') {
                threshold.unhealthy++;
            }

            if (threshold.healthy == 5) {
                status.content = 'healthy';
            } else if (threshold.unhealthy == 2) {
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
