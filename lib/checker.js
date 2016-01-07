var net = require('net'),
    worker = require('child_process');

var Instance = function () {
    this.status = 'n/a';
};

Instance.prototype = {
    setStatus: function (status) {
        this.status = status;
    },
    getStatus: function () {
        return this.status;
    }
};

function ping(config) {
    console.log(config);
    setInterval(function () {
        /* ping to instance */
        console.log('pinging ' + config.address);
    }, config.checkInterval * 1000);
};

function http(config) {
    console.log(config);
    setInterval(function () {
        /* check to instance */
        console.log('checking ' + config.address);
    }, config.checkInterval * 1000);
};

process.on('message', function (instance) {
    if (instance.type === "ping") {
        ping(instance);
    } else if (instance.type === "http") {
        http(instance);
    } else {
        throw new Error('Instance type not supported');
    }
});
