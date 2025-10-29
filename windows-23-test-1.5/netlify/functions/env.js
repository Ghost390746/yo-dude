export const handler = async () => {
  try {
    // ✅ Access environment variables from Netlify Secrets
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    // ✅ Check that required Supabase secrets exist
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials in Netlify environment variables.");
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Missing Supabase credentials.",
        }),
      };
    }

    // ✅ Return ONLY safe public keys for frontend use
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Environment variables loaded successfully.",
        env: {
          SUPABASE_URL: supabaseUrl,
          SUPABASE_KEY: supabaseKey,
        },
        // For internal debugging (not exposed to frontend)
        status: {
          EMAIL_USER: !!emailUser,
          EMAIL_PASS: !!emailPass,
        },
      }),
    };
  } catch (err) {
    console.error("Error reading Netlify secrets:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Failed to load environment variables.",
      }),
    };
  }
};
