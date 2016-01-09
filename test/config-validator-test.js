var validator = require('../lib/config-validator'),
    assert = require('assert');

describe('Given config data is valid', function () {
    describe('When no default data is missing', function () {
        var config = {
            checks: [
                {
                    "id": "EG",
                    "type": "http",
                    "port": 80,
                    "path": "/ping",
                    "address": "52.76.216.3",
                    "responseTimeout": 5,
                    "checkInterval": 5,
                    "unhealthyThreshold": 2,
                    "healthyThreshold": 10
                }
            ],
            alerts: [
                {
                    "checks": "EG.*",
                    "type": "email",
                    "address": "usman@proto-garage.com",
                    "statuses": [
                        "unhealthy"
                    ]
                }
            ]
        };

        it('should have no changes on the config data', function () {
            var actual = validator.validate(config);
            assert.deepEqual(actual, config);
        });
    });

    describe('When default data are missing', function () {
        var config = {
                checks: [
                    {
                        "id": "EG",
                        "type": "http",
                        "address": "52.76.216.3"
                    }
                ],
                alerts: [
                    {
                        "checks": "EG.*",
                        "type": "email",
                        "address": "usman@proto-garage.com"
                    }
                ]
            },
            expected = {
                checks: [
                    {
                        "id": "EG",
                        "type": "http",
                        "port": 80,
                        "path": "/ping",
                        "address": "52.76.216.3",
                        "responseTimeout": 10,
                        "checkInterval": 60,
                        "unhealthyThreshold": 2,
                        "healthyThreshold": 5
                    }
                ],
                alerts: [
                    {
                        "checks": "EG.*",
                        "type": "email",
                        "address": "usman@proto-garage.com",
                        "statuses": ['unhealthy', 'healthy']
                    }
                ]
            };

        it('should return the config with the default data', function () {
            var actual = validator.validate(config);
            assert.deepEqual(actual, expected);
        });
    });
});

describe('Given config is invalid', function () {
    describe('When invalid for checks', function () {
        var config = {
            checks: [
                {
                    "id": "EG",
                    "type": "http"
                }
            ],
            alerts: [
                {
                    "checks": "EG.*",
                    "type": "email",
                    "address": "usman@proto-garage.com"
                }
            ]
        };

        it('should throw an error', function () {
            assert.throws(function () {
                validator.validate(config)
            }, Error, 'Invalid configuration, must have field \'address\' in checks.');
        });
    });

    describe('When invalid for alerts', function () {
        var config = {
            checks: [
                {
                    "id": "EG",
                    "type": "http",
                    "address": "52.76.216.3"
                }
            ],
            alerts: [
                {
                    "checks": "EG.*",
                    "address": "usman@proto-garage.com"
                }
            ]
        };

        it('should throw an error', function () {
            assert.throws(function () {
                validator.validate(config)
            }, Error, 'Invalid configuration, must have field \'type\' in alerts.');
        });
    });
});