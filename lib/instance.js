var util = require('util'),
    EventEmitter = require('events').EventEmitter;


var Instance = function (config) {
    var status = Object.create({
        content: ''
    });

    var threshold = {
        healthy: 0,
        unhealthy: 0
    };

    Object.observe(status, function (change) {
        threshold.healthy = 0;
        threshold.unhealthy = 0;
        this.emit('change', config);
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
};

util.inherits(Instance, EventEmitter);
exports.Instance = Instance;
