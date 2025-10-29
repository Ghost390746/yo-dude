import { Pool } from "@neondatabase/serverless";

export const handler = async () => {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const res = await pool.query("SELECT NOW();");
    await pool.end();

    console.log("✅ Neon ping successful at:", res.rows[0].now);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Neon pinged successfully" }),
    };
  } catch (err) {
    console.error("❌ Neon ping failed:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};
