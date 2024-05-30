const nodemailer = require("nodemailer");
// FIXME: EMAIL FUNCTIONALITY NOT YET WORKING 
const sendEmail = async (options) => {
  try {
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "pattie.hudson@ethereal.email",
        pass: "26UUqSFGcJFPb7mpdd",
      },
    });

    // Define the mail options
    const mailOptions = {
      from: "mail@nftmarketplace.com", // Sender address
      to: options.email, // Recipient address
      subject: options.subject, // Subject line
      text: options.message, // Plain text body (make sure to use options.message instead of options.text)
      // html: options.html, // HTML body (if applicable)
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("There was an error sending the email. Try again later!");
  }
};

module.exports = sendEmail;
