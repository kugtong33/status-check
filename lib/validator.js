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
}, schema = {
    config: {
        "type": "object",
        "properties": {
            "checks": {"type": "array"},
            "alerts": {"type": "array", "default": []}
        },
        "required": ["checks"]
    },
    check: {
        "type": "object",
        "format": "full",
        "properties": {
            "id": {"type": "string"},
            "type": {"type": "string"},
            "address": {"type": "string", "format": "ipv4"},
            "responseTimeout": {"type": "number", "default": 10},
            "checkInterval": {"type": "number", "default": 60},
            "unhealthyThreshold": {"type": "number", "default": 2},
            "healthyThreshold": {"type": "number", "default": 5}
        },
        "required": ["id", "type", "address"]
    },
    "http": {
        "type": "object",
        "properties": {
            "port": {"type": "number", "default": 80},
            "path": {"type": "string", "default": "/ping"}
        }
    },
    alert: {
        "type": "object",
        "format": "full",
        "properties": {
            "type": {"type": "string"},
            "address": {"type": "string", "format": "email"},
            "checks": {"type": "string", "default": ".+"},
            "statuses": {"type": "array", "default": ["unhealthy", "healthy"]}
        },
        "required": ["type", "address"]
    }
};

var ajv = require('ajv')(),
    valid;

exports.validate = function (config) {

    valid = ajv.validate(schema.config, config);

    config.checks.forEach(function (check, index) {
        if (check.type == 'http') {
            valid = ajv.validate(schema.http, check);
            if (valid) {
                config.checks[index] = check;
            }
        }
        valid = ajv.validate(schema.check, check);
        if (valid) {
            config.checks[index] = check;
        }
    });

    config.alerts.forEach(function (alert, index) {
        valid = ajv.validate(schema.alert, alert);
        if (valid) {
            config.alerts[index] = alert;
        }
    });

    return config;
};