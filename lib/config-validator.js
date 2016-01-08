var defaults = {
    checks: {
        responseTimeout: 10,
        checkInterval: 60,
        unhealthyThreshold: 2,
        healthyThreshold: 5
    },
    http: {
        port: 80,
        path: '/ping'
    },
    alerts: {
        checks: '.+',
        statuses: ['unhealthy', 'healthy']
    },
}, required = {
    checks: ['id', 'type', 'address',],
    alerts: ['type', 'address']
};


function synchronize(config, defaultData) {
    config.forEach(function (parameter) {
        Object.keys(defaultData).forEach(function (key) {
            if (!parameter.hasOwnProperty(key)) {
                parameter[key] = defaultData[key];
            }
        });

        if (parameter.hasOwnProperty('type')) {
            if (parameter.type == 'http') {
                Object.keys(defaults.http).forEach(function (key) {
                    if (!parameter.hasOwnProperty(key)) {
                        parameter[key] = defaults.http[key];
                    }
                });
            }
        }
    });
}

exports.validate = function (config) {
    Object.keys(required).forEach(function (field) {
        if (config.hasOwnProperty(field)) {
            required[field].forEach(function (key) {
                config[field].forEach(function (data) {
                    if (!data.hasOwnProperty(key)) {
                        throw new Error('Invalid configuration, must have field \'' + key + '\' in ' + field + '.');
                    }
                });
            });
        }
    });

    /* Synchronize default values */
    synchronize(config.checks, defaults.checks);
    synchronize(config.alerts, defaults.alerts);

    return config;
};