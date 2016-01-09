exports.send = function (config, callback) {
    var mailer = require('nodemailer');

    config.alerts.forEach(function (config) {

        mailer.createTransport('').sendMail(
            {
                from: '',
                to: info.email,
                subject: '',
                text: ''
            }, function (error, info) {

            }
        );
    });

};
