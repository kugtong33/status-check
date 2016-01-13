var mailer = require('nodemailer'),
    email = require('../conf/email.json'),
    transporter = mailer.createTransport('smtps://'
        + email.username + '%40gmail.com:'
        + email.password + '@smtp.gmail.com');


function alert(info, config) {
    return new Promise(function (resolve, reject) {
        transporter.sendMail({
            from: email.username + '@gmail.com',
            to: info.address,
            subject: 'Status Check',
            text: config.id + ' status: ' + config.status.content
        }, function (error, info) {
            if (error) {
                return reject(error);
            }
            resolve(info);
        });
    });
}

exports.send = function (config) {
    config.alerts.forEach(function (info) {
        if (config.id.match(info.checks)) {
            if (info.statuses.indexOf(config.status.content) > -1) {
                alert(info, config).then(null, console.log);
            }
        }
    });
};
