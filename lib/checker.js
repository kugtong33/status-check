var net = require('net'),
    http = require('http'),
    process = require('child_process');

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

exports.ping = function (config) {
    while (true) {
        setInterval(function (config) {
            var instance = new Instance();

            /* ping to instance */
            process.exec('ping', );


        }, config.checkInterval * 1000);
    }
};

exports.http = function (config) {

};