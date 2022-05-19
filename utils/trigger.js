const mailer = require("nodemailer");

const username = process.env.USERNAME_EMAIL;
const password = process.env.PASSWORD_EMAIL;

module.exports.sendEmail = async (to, text) => {
    try {
        const transporter = mailer.createTransport({
            host: "smtp.gmail.com",
            auth: {
                user: username,
                pass: password
            }
        });
        const mailOptions = {
            to: to,
            subject: "Notifier PTTPK",
            html: `<p>${text}</p> 
            <br/>
            <a href='http://siasn.bkd.jatimprov.go.id/pttpk-penilaian'>
            Buka
            </a>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log(error);
    }
};
