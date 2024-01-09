import nodemailer from "nodemailer";

const Mailer = (email: string, message: string, subject: string) => {
  const Transporter = nodemailer.createTransport({
    host: "server223.web-hosting.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: subject,
    html: `
        <body>
          <div>
            <img style='background-color: white;' src='https://res.cloudinary.com/dcpmainhy/image/upload/v1680959833/qvfcwq4bzdbfcginvqmc.png' height=150px width=100% alt='web_logo'/>
          </div>
          <div>
            ${message}
          </div>
        </body>
      `,
  };

  Transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      console.log(info);
    }
  });
};
export default Mailer;
