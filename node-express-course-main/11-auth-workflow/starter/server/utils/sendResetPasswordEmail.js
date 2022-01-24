const sendEmail = require("./sendEmail");

const sendResetPasswordEmail = async ({ name, email, token, origin }) => {
  // the front-end looks for the token and the email:
  const resetURL = `${origin}/user/reset-password?token=${token}&email=${email}`;

  const message = `<p>Please click on the following link to reset your password : <a href="${resetURL}">Reset Password</a></p>`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `<h4>Hello, ${name}</h4>
    ${message}`,
  });
};

module.exports = sendResetPasswordEmail;
