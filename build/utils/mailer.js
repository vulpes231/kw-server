"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const Mailer = (email, message) => {
    const Transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            type: "OAUTH2",
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: "Verification Email",
        html: `
            <body>
              <div>
                <img style='background-color: white;' src='https://res.cloudinary.com/dcpmainhy/image/upload/v1680959833/qvfcwq4bzdbfcginvqmc.png' height=150px width=100% alt='logo'/>
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
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
};
exports.default = Mailer;
