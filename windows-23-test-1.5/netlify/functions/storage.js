const { createClient } = require("@supabase/supabase-js");

// Environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Can be anon or service role key
const storageUrl = process.env.STORAGE_URL; // New env for storage bucket public base URL

const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event) => {
  try {
    const { method } = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};

    // POST: Upload a file
    if (method === "POST") {
      const { file_name, file_content, file_type, uploader_id } = body;

      if (!file_name || !file_content || !file_type || !uploader_id) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
      }

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from("all-storage")
        .upload(`${uploader_id}/${file_name}`, Buffer.from(file_content, "base64"), { upsert: true });

      if (uploadError) return { statusCode: 400, body: JSON.stringify({ error: uploadError.message }) };

      // Build the file URL dynamically using STORAGE_URL
      const fileUrl = `${storageUrl}/${uploader_id}/${file_name}`;

      // Insert record into storage table
      const { error: dbError } = await supabase
        .from("storage")
        .insert([{ uploader_id, file_name, file_type, file_url: fileUrl }]);

      if (dbError) return { statusCode: 400, body: JSON.stringify({ error: dbError.message }) };

      return { statusCode: 200, body: JSON.stringify({ message: "File uploaded", file_url: fileUrl }) };
    }

    // GET: Fetch all files
    if (method === "GET") {
      const { data, error } = await supabase.from("storage").select("*").order("created_at", { ascending: false });
      if (error) return { statusCode: 400, body: JSON.stringify({ error: error.message }) };

      // Map URLs to use STORAGE_URL
      const files = data.map(f => ({
        ...f,
        file_url: `${storageUrl}/${f.uploader_id}/${f.file_name}`
      }));

      return { statusCode: 200, body: JSON.stringify({ files }) };
    }

    return { statusCode: 405, body: "Method not allowed" };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
