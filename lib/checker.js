exports.ping = function (instance) {
    var config = instance.getConfig();
    var worker = require('child_process');

    setInterval(function () {
        /* TODO translate using promises */
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

exports.http = function (instance) {
    var config = instance.getConfig();
    var http = require('http');

    setInterval(function () {
        /* TODO translate using promise */
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