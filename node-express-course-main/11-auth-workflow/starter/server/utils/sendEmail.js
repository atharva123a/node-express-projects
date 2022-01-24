const nodemailer = require("nodemailer");
const nodeMailerConfig = require("./nodemailerConfig");
const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();

  //   using that object here:
  const transporter = nodemailer.createTransport(nodeMailerConfig);

  // send mail with defined transport object
  // returns a promise:
  return transporter.sendMail({
    from: 'Athens Badass" <athens@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
