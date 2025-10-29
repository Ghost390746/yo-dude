import { initSupabase } from "../../lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function handler(event) {
  try {
    const { identifier, password } = JSON.parse(event.body);
    const supabase = initSupabase();

    // Query user by email or username
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${identifier},username.eq.${identifier}`)
      .limit(1);

    if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };
    const user = users[0];
    if (!user) return { statusCode: 404, body: JSON.stringify({ error: "User not found" }) };

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return { statusCode: 401, body: JSON.stringify({ error: "Invalid password" }) };

    return {
      statusCode: 200,
      body: JSON.stringify({ username: user.username, email: user.email }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
