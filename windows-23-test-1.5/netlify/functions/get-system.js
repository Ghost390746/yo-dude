import { Client } from "pg";

export const handler = async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const result = await client.query("SELECT id, name, owner FROM os_systems WHERE public=true");
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, systems: result.rows }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: "DB query failed" }) };
  } finally {
    await client.end();
  }
};
