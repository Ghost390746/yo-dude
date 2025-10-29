import { Pool } from "@neondatabase/serverless";

export const handler = async () => {
  try {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    await pool.query("SELECT NOW()");
    await pool.end();

    console.log("✅ Neon pinged via schedule");
    return { statusCode: 200, body: "Ping OK" };
  } catch (err) {
    console.error("❌ Ping error:", err);
    return { statusCode: 500, body: err.message };
  }
};

export const config = {
  schedule: "*/4 * * * *", // Every 4 minutes
};
