import nodemailer from "nodemailer";
import { initSupabase } from "../../lib/supabaseClient"; // async init

export const handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Email required" }),
      };
    }

    // Initialize Supabase client
    const supabase = await initSupabase();
    if (!supabase) {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: "Supabase not initialized" }),
      };
    }

    // Insert email into subscribers table (ignore if already exists)
    const { error } = await supabase.from("subscribers").insert([{ email }]);

    if (error && !error.message.includes("duplicate key")) {
      console.error("Supabase insert error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, error: error.message }),
      };
    }

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Hugg Store Updates" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Welcome to Hugg Store Updates!",
      text: `Hello!\n\nThank you for subscribing to updates from our site and GitHub repo.\nYou'll automatically receive notifications when new features or improvements go live.\n\nIf you ever need help, contact us at babyyodacutefry@hugg.store.\n\n— The Hugg Store Team ❤️`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Subscribed and email sent successfully.",
      }),
    };
  } catch (err) {
    console.error("Error in subscribe function:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
