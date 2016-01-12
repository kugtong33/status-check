var mailer = require('nodemailer'),
    email = require('../conf/email.json');

exports.send = function (config, callback) {
    var transporter = mailer.createTransport('smtps://'
        + email.username + '%40gmail.com:'
        + email.password + '@smtp.gmail.com');

    config.alerts.forEach(function (info) {
        if (config.id.match(info.checks)) {
            /* TODO translate using promises */
            if (info.statuses.indexOf(config.status.content) > -1) {
                transporter.sendMail({
                    from: email.username + '@gmail.com',
                    to: info.address,
                    subject: 'Status Check',
                    text: config.id + ' status: ' + config.status.content
                }, function (error, info) {
                    callback(error, info);
                });
            }
        }
    });
};
