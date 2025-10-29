import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler = async (event) => {
  try {
    const { email, username, password } = JSON.parse(event.body);

    if (!email || !username || !password) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing fields' }) };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase.from('users').insert([
      { email, username, password_hash: hashedPassword }
    ]);

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
