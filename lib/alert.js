exports.Alert = function () {

};

exports.Alert.prototype = {
    send: function (config, callback) {
        var mailer = require('nodemailer');

        mailer.createTransport('').sendMail(
            {
                from: '',
                to: '',
                subject: '',
                text: ''
            }, function (error, info) {

            }
        );
    }
};