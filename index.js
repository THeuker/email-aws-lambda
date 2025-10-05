const nodemailer = require("nodemailer");

exports.handler = async (event) => {
    const { name, email, subject, message, recipient } = JSON.parse(event.body);
    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 465,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const userMessage = `Er is een contactformulier ingediend:\nNaam: ${name}\nE-mail: ${email}\n\n${message}`;
    const userMail = {
        from: `Thomas Heuker <${process.env.GMAIL_USER}>`,
        to: recipient,
        subject: subject ?? "Contactformulier inzending",
        text: userMessage,
        replyTo: email
    };

    try {
        const res = await transporter.sendMail(userMail);
        console.log("User email sent", res);
    } catch (err) {
        console.log("User email error", err);
    }

    const staffMessage = `Er is een contactformulier ingediend:\nNaam: ${name}\nE-mail: ${email}\nOntvanger: ${recipient}`;
    const staffMail = {
        from: `Thomas Heuker <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_STAFF,
        subject: "Contactformulier inzending",
        text: staffMessage,
    };

    try {
        const res = await transporter.sendMail(staffMail);
        console.log("Staff email sent", res);
    } catch (err) {
        console.log("Staff email error", err);
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Email sent" }),
    };
};