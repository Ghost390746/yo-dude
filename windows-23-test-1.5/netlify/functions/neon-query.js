// netlify/functions/neon-query.js
import { Pool } from "@neondatabase/serverless";

export const handler = async (event) => {
  try {
    // Create a Neon connection pool
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // Example: check if email exists or return all users
    const { action, email } = JSON.parse(event.body || "{}");

    let result;
    if (action === "checkEmail") {
      result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    } else if (action === "getAllUsers") {
      result = await pool.query("SELECT email FROM users");
    } else {
      result = { rows: [], message: "No valid action provided" };
    }

    await pool.end(); // close connection after query

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result.rows }),
    };
  } catch (err) {
    console.error("Neon query error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
