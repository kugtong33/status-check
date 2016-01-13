function _http(config) {
    return new Promise(function (resolve, reject) {
        require('http').get({
            hostname: config.address,
            port: 80,
            path: config.path
        }, function (res) {
            resolve((res.statusCode == 200) ? 'healthy' : 'unhealthy');
        }).on('socket', function (socket) {
            socket.setTimeout(config.responseTimeout);
        }).on('error', function (err) {
            reject(err);
        });
    });
}

function _ping(config) {
    return new Promise(function (resolve, reject) {
        require('child_process').exec(
            'ping -c 1 -q -W '
            + config.responseTimeout + ' '
            + config.address + ' | grep -oP \'\\d+(?=% packet loss)\'',
            function (error, stdout) {
                if (error) {
                    reject(error);
                }
                resolve((parseInt(stdout) == 0) ? 'healthy' : 'unhealthy');
            }
        );
    });
}

exports.ping = function (instance) {
    setInterval(function () {
        _ping(instance.getConfig()).then(instance.notify);
    }, instance.getConfig().checkInterval * 1000);
};

exports.http = function (instance) {
    setInterval(function () {
        _http(instance.getConfig()).then(instance.notify, function () {
            instance.notify('unhealthy');
        });
    }, instance.getConfig().checkInterval * 1000);
}