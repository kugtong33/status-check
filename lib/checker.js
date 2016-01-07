var Instance = function (config) {
    var status = Object.create({
        content: ''
    });

    var threshold = {
        healthy: 0,
        unhealthy: 0
    };

    Object.observe(status, function (change) {
        /* send email for change status */
        console.log(config.id + ': ' + JSON.stringify(change));

        /* reset threshold */
        threshold.healthy = 0;
        threshold.unhealthy = 0;
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
};


function ping(config) {
    var worker = require('child_process'),
        instance = new Instance(config);

    setInterval(function () {
        /* ping to instance */
        worker.exec(
            'ping -c 1 -q -W '
            + config.responseTimeout + ' '
            + config.address + ' | grep -oP \'\\d+(?=% packet loss)\'',
            function (error, stdout, stderr) {
                instance.notify(
                    ((parseInt(stdout) == 0) ? 'healthy' : 'unhealthy')
                );
            }
        );
    }, config.checkInterval * 1000);
};

function http(config) {
    var http = require('http'),
        instance = new Instance(config);

    setInterval(function () {
        /* check to instance */
        http.get({
            hostname: config.address,
            port: 80,
            path: config.path
        }, function (res) {
            instance.notify(
                ((res.statusCode == 200) ? 'healthy' : 'unhealthy')
            );
        }).on('socket', function (socket) {
            socket.setTimeout(config.responseTimeout);
        }).on('error', function (err) {
            instance.notify('unhealthy');
        });
    }, config.checkInterval * 1000);
}
;

process.on('message', function (instance) {
    if (instance.type === "ping") {
        ping(instance);
    } else if (instance.type === "http") {
        http(instance);
    } else {
        throw new Error('Instance type not supported');
    }
});
