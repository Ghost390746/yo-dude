import nodemailer from "nodemailer";

export const handler = async (event) => {
  try {
    const { email, username, code } = JSON.parse(event.body);

    // Access secrets directly from Netlify environment variables
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"WebBro OS Support" <${process.env.EMAIL_USER}>`, // Custom display name
      to: email,
      subject: "Your Verification Code",
      headers: {
        "X-Custom-Header": "WebBro OS Verification", // Custom header
      },
      text: `Hello ${username},

Your verification code is: ${code}

Please enter this code in the application to complete your registration. This code is valid for one-time use only.

For any questions or assistance, contact us at: babyyodacutefry@hugg.store

Best regards,
The WebBro OS Team`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Email sent!" }),
    };
  } catch (err) {
    console.error("Error sending email:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Failed to send email." }),
    };
  }
};
