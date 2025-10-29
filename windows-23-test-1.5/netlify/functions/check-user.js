// netlify/functions/check-user.js
import { Client } from "@neondatabase/serverless";

export const handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body || "{}");

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Email is required." }),
      };
    }

    // Connect to Neon DB using secret from Netlify
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    await client.connect();

    // Query for the user by email
    const res = await client.query(
      "SELECT email, username, two_step_enabled FROM users WHERE email = $1",
      [email]
    );

    await client.end();

    if (res.rows.length > 0) {
      // User exists
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, exists: true, user: res.rows[0] }),
      };
    } else {
      // User not found
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, exists: false }),
      };
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: "Server error." }),
    };
  }
};
