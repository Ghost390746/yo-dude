// src/components/Explore.jsx
import { useState, useEffect } from "react";
import { initSupabase } from "../lib/supabaseClient";

export default function Explore({ user }) {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const supabase = initSupabase();

  // 🔹 Fetch all public projects on load
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("user_projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.error(error);
      else setProjects(data);
    };
    fetchProjects();
  }, []);

  // 🔹 Fetch comments for selected project
  useEffect(() => {
    if (!selectedProject) return;
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("project_comments")
        .select("*")
        .eq("project_id", selectedProject.id)
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      else setComments(data);
    };
    fetchComments();
  }, [selectedProject]);

  // 🔹 Add comment
  const addComment = async () => {
    if (!comment.trim() || !user) return;
    const { error } = await supabase
      .from("project_comments")
      .insert([{ project_id: selectedProject.id, user_id: user.id, content: comment }]);

    if (error) console.error(error);
    else {
      setComments([...comments, { content: comment, user_id: user.id }]);
      setComment("");
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", gap: "1rem" }}>
      {/* 🔹 Projects List */}
      <div style={{ width: "300px", overflowY: "auto", borderRight: "1px solid #ccc", padding: "10px" }}>
        <h3>Explore Projects</h3>
        {projects.map((project) => (
          <div
            key={project.project_name + project.owner_id}
            style={{
              padding: "8px",
              marginBottom: "6px",
              cursor: "pointer",
              background: selectedProject?.id === project.id ? "#eee" : "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
            onClick={() => setSelectedProject(project)}
          >
            <strong>{project.project_name}</strong>
            <div style={{ fontSize: "12px", color: "#555" }}>By: {project.owner_id}</div>
          </div>
        ))}
      </div>

      {/* 🔹 Project Preview */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {selectedProject ? (
          <>
            <h3>{selectedProject.project_name}</h3>
            <div style={{ flex: 1, border: "1px solid #ccc", marginBottom: "10px" }}>
              <iframe
                title={selectedProject.project_name}
                sandbox="allow-scripts"
                srcDoc={generatePreviewHTML(selectedProject.files)}
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>

            {/* Comments Section */}
            <div style={{ borderTop: "1px solid #ccc", paddingTop: "10px" }}>
              <h4>Comments</h4>
              <div style={{ maxHeight: "150px", overflowY: "auto", marginBottom: "10px" }}>
                {comments.map((c, i) => (
                  <div key={i} style={{ padding: "4px 0", borderBottom: "1px solid #eee" }}>
                    <strong>{c.user_id}</strong>: {c.content}
                  </div>
                ))}
              </div>
              {user ? (
                <div style={{ display: "flex", gap: "5px" }}>
                  <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{ flex: 1 }}
                  />
                  <button onClick={addComment}>Post</button>
                </div>
              ) : (
                <p style={{ fontSize: "12px", color: "#555" }}>Login to comment</p>
              )}
            </div>
          </>
        ) : (
          <p style={{ color: "#888", fontStyle: "italic" }}>Select a project to preview</p>
        )}
      </div>
    </div>
  );
}

// 🔹 Helper: generate live preview HTML from saved files
function generatePreviewHTML(files) {
  let combinedCode = "";
  const traverse = (folder) => {
    for (const key in folder) {
      if (typeof folder[key] === "string" && key.endsWith(".jsx")) {
        combinedCode += folder[key] + "\n";
      } else if (typeof folder[key] === "object") traverse(folder[key]);
    }
  };
  traverse(files);

  return `
    <html>
      <head><meta charset="UTF-8"></head>
      <body>
        <div id="root"></div>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script type="text/babel">${combinedCode}</script>
      </body>
    </html>
  `;
}
