var Instance = require('../lib/instance').Instance,
    assert = require('assert'),
    config = {
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

describe('Given status is unknown', function () {
    describe('When notified with \'healthy\'', function () {
        var instance = new Instance(Object.create(config).checks[0]);

        it('should increment healthy threshold counter', function () {
            var expected = {
                healthy: 1,
                unhealthy: 0
            };

            instance.notify('healthy');
            assert.deepEqual(instance.getThreshold(), expected);
        });
    });

    describe('When notified with \'healthy\' threshold times', function () {
        var instance = new Instance(Object.create(config).checks[0]);
        it('should change its status to healthy', function () {
            var expected = {
                content: 'healthy'
            };

            for (var i = 0; i < config.checks[0].healthyThreshold; i++) {
                instance.notify('healthy');
            }
            assert.deepEqual(instance.getStatus(), expected);
        });
    });

    describe('When notified with \'unhealthy\'', function () {
        var instance = new Instance(Object.create(config).checks[0]);
        it('should increment unhealthy threshold counter', function () {

            var expected = {
                healthy: 0,
                unhealthy: 1
            };

            instance.notify('unhealthy');
            assert.deepEqual(instance.getThreshold(), expected);
        });
    });

    describe('When notified with \'unhealthy\' threshold times', function () {
        var instance = new Instance(Object.create(config).checks[0]);
        it('should change its status to unhealthy', function () {
            var expected = {
                content: 'unhealthy'
            };

            for (var i = 0; i < config.checks[0].unhealthyThreshold; i++) {
                instance.notify('unhealthy');
            }
            assert.deepEqual(instance.getStatus(), expected);
        });
    });
});

describe('Given status is healthy', function () {
    describe('When notified with \'healthy\'', function () {
        var instance = new Instance(Object.create(config).checks[0]);
        instance.setStatus({
            content: 'healthy'
        });

        it('should not increment healthy threshold counter', function () {
            var expected = {
                healthy: 0,
                unhealthy: 0
            };

            instance.notify('healthy');
            assert.deepEqual(instance.getThreshold(), expected);
        });
    });

    describe('When notified with \'unhealthy\'', function () {
        var instance = new Instance(Object.create(config).checks[0]);
        instance.setStatus({
            content: 'healthy'
        });

        it('should increment unhealthy threshold counter', function () {

            var expected = {
                healthy: 0,
                unhealthy: 1
            };

            instance.notify('unhealthy');
            assert.deepEqual(instance.getThreshold(), expected);
        });
    });

    describe('When notified with \'unhealthy\' threshold times', function () {
        var instance = new Instance(Object.create(config).checks[0]);
        instance.setStatus({
            content: 'healthy'
        });

        it('should change its status to unhealthy', function () {
            var expected = {
                content: 'unhealthy'
            };

            for (var i = 0; i < config.checks[0].unhealthyThreshold; i++) {
                instance.notify('unhealthy');
            }
            assert.deepEqual(instance.getStatus(), expected);
        });
    });
});

describe('Given status is unhealthy', function () {
    describe('When notified with \'unhealthy\'', function () {
        var instance = new Instance(Object.create(config).checks[0]);
        instance.setStatus({
            content: 'unhealthy'
        });

        it('should not increment unhealthy threshold counter', function () {
            var expected = {
                healthy: 0,
                unhealthy: 0
            };

            instance.notify('unhealthy');
            assert.deepEqual(instance.getThreshold(), expected);
        });
    });

    describe('When notified with \'healthy\'', function () {
        var instance = new Instance(Object.create(config).checks[0]);
        instance.setStatus({
            content: 'unhealthy'
        });

        it('should increment healthy threshold counter', function () {

            var expected = {
                healthy: 1,
                unhealthy: 0
            };

            instance.notify('healthy');
            assert.deepEqual(instance.getThreshold(), expected);
        });
    });

    describe('When notified with \'healthy\' threshold times', function () {
        var instance = new Instance(Object.create(config).checks[0]);
        instance.setStatus({
            content: 'unhealthy'
        });

        it('should change its status to healthy', function () {
            var expected = {
                content: 'healthy'
            };

            for (var i = 0; i < config.checks[0].healthyThreshold; i++) {
                instance.notify('healthy');
            }
            assert.deepEqual(instance.getStatus(), expected);
        });
    });
});