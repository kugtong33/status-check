var worker = require('child_process');

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
    setInterval(function () {
        /* ping to instance */
        worker.exec(
            'ping -c 1 -W '
            + config.responseTimeout + ' '
            + config.address + ' | grep \'packet\'',
            function (error, stdout, stderror) {
                console.log(stdout);
            }
        );
    }, config.checkInterval * 1000);
};

function http(config) {
    var http = require('http');
    setInterval(function () {
        /* check to instance */
        http.get({
            hostname: config.address,
            port: 80,
            path: config.path
        }, function (res) {
            console.log(res.statusCode);
        });
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
