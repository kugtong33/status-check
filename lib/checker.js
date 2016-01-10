var Instance = require('./instance').Instance,
    alert = require('./alert');

function ping(config) {
    var worker = require('child_process'),
        instance = new Instance(config);

    instance.on('change', function () {
        config.status = instance.getStatus();
        alert.send(config, function (error, info) {
            if (error) {
                throw error;
            }
        });
    });

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

    instance.on('change', function () {
        config.status = instance.getStatus();
        alert.send(config, function (error, info) {
            console.log(error);
        });
    });

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

process.on('message', function (data) {
    if (typeof data === 'string') {
        if (data === 'status') {
            process.send(instance);
        }
    } else {
        if (data.type === "ping") {
            ping(data);
        } else if (data.type === "http") {
            http(data);
        } else {
            throw new Error('Instance type not supported');
        }
    }

});
