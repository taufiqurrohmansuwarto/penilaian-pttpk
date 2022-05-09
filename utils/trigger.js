const mailer = require("nodemailer");

const username = process.env.USERNAME_EMAIL;
const password = process.env.PASSWORD_EMAIL;

module.exports.sendEmail = () => {
    const account = mailer.createTestAccount();

    const transporter = account;
};
