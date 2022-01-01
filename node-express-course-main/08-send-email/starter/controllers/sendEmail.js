require("dotenv").config();
const nodemailer = require("nodemailer");

const sgMail = require("@sendgrid/mail");
const { StatusCodes } = require("http-status-codes");

// we use nodemailer to send emails:
const sendMailEthereal = async (req, res) => {
  const transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "grant.kris90@ethereal.email",
      pass: "jXP4G9twdXFuJV7Nfr",
    },
  });

  const info = await transporter.sendMail({
    from: "'Athens Badass' <athensbadass@gmail.com>",
    to: "foo@example.com",
    subject: "Saying GoodBye",
    html: "<h2>Good Bye!!</h2>",
  });

  res.status(200).json({ info });
};

const sendMail = async (req, res) => {
  // set up our api!
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    //   using env files only because this will be pushed to github!
    to: process.env.to,
    from: process.env.from,
    subject: "Sending love using NodeJs email sender!",
    text: "This email aims to send love to the person reading the email! If you are reading this email, chances are that you are a cute person, because this service is only available to cute people of this universe :)",
  };

  try {
    const info = await sgMail.send(msg);
    res.status(StatusCodes.OK).json(info);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Something went wrong!");
  }
};

module.exports = sendMail;
