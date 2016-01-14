var schema = {
    config: {
        "type": "object",
        "properties": {
            "checks": {"type": "array"},
            "alerts": {"type": "array", "default": []}
        },
        "required": ["checks", "alerts"]
    },
    check: {
        "type": "object",
        "properties": {
            "id": {"type": "string"},
            "type": {"type": "string"},
            "address": {"type": "string", "format": "ipv4"},
            "responseTimeout": {"type": "number", "default": 10},
            "checkInterval": {"type": "number", "default": 60},
            "unhealthyThreshold": {"type": "number", "default": 2},
            "healthyThreshold": {"type": "number", "default": 5}
        },
        "required": [
            "id",
            "type",
            "address",
            "responseTimeout",
            "checkInterval",
            "unhealthyThreshold",
            "healthyThreshold"
        ]
    },
    "http": {
        "type": "object",
        "properties": {
            "port": {"type": "number", "default": 80},
            "path": {"type": "string", "default": "/ping"}
        },
        "required": ["port", "path"]
    },
    alert: {
        "type": "object",
        "properties": {
            "type": {"type": "string"},
            "address": {"type": "string", "format": "email"},
            "checks": {"type": "string", "default": ".+"},
            "statuses": {"type": "array", "default": ["unhealthy", "healthy"]}
        },
        "required": ["type", "address", "checks", "statuses"]
    }
};

var ajv = require('ajv')({
    allErrors: true,
    useDefaults: true
});

function _validate(schema, config) {
    var valid = ajv.validate(schema, config);
    if (!valid) {
        throw new Error(ajv.errors[0].message);
    }
}

exports.validate = function (config) {
    _validate(schema.config, config);

    config.checks.forEach(function (check) {
        if (check.type == 'http') {
            _validate(schema.http, check);
        }
        _validate(schema.check, check);
    });

    config.alerts.forEach(function (alert) {
        _validate(schema.alert, alert);
    });

    return config;
};