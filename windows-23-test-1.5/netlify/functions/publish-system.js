import { Client } from "pg";

export const handler = async (event) => {
  const { owner, name, components } = JSON.parse(event.body);

  if (!owner || !name || !components) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: "Missing fields" }) };
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  try {
    const query = `
      INSERT INTO os_systems(owner, name, components, public)
      VALUES($1, $2, $3, true)
      RETURNING id, name, owner
    `;
    const values = [owner, name, components];
    const result = await client.query(query, values);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, system: result.rows[0] }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: "Failed to save system" }) };
  } finally {
    await client.end();
  }
};
