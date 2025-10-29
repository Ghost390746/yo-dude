// src/components/CodeEditorIDE.jsx
import { useState } from "react";
import { initSupabase } from "../lib/supabaseClient";
import * as Babel from "@babel/standalone";
import MonacoEditor from "@monaco-editor/react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const FILE = "file";
const FOLDER = "folder";

// 🔹 Reusable Tree Node (File or Folder)
function TreeNode({
  path,
  name,
  node,
  selectedFile,
  setSelectedFile,
  createFile,
  createFolder,
  renameNode,
  deleteNode,
  moveNode,
}) {
  const isFolder = typeof node === "object";
  const [, drag] = useDrag(() => ({ type: isFolder ? FOLDER : FILE, item: { path } }));
  const [, drop] = useDrop({
    accept: [FILE, FOLDER],
    drop: (item) => {
      if (isFolder) moveNode(item.path, path);
    },
  });

  return (
    <div ref={(nodeRef) => drag(drop(nodeRef))} style={{ marginLeft: "12px" }}>
      <div
        style={{
          cursor: "pointer",
          fontWeight: selectedFile === path ? "bold" : "normal",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={() => !isFolder && setSelectedFile(path)}
      >
        <span>{isFolder ? "📁" : "📄"} {name}</span>
        <span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newName = prompt(`Rename ${name} to:`, name);
              if (newName) renameNode(path, newName);
            }}
            style={{ fontSize: "10px" }}
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteNode(path);
            }}
            style={{ fontSize: "10px" }}
          >
            ❌
          </button>
          {isFolder && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const fileName = prompt("New file name:", "newFile.jsx");
                  if (fileName) createFile(path, fileName);
                }}
                style={{ fontSize: "10px" }}
              >
                ➕📄
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const folderName = prompt("New folder name:");
                  if (folderName) createFolder(path, folderName);
                }}
                style={{ fontSize: "10px" }}
              >
                ➕📁
              </button>
            </>
          )}
        </span>
      </div>
      {isFolder &&
        Object.entries(node).map(([childName, childNode]) => (
          <TreeNode
            key={childName}
            path={`${path}/${childName}`}
            name={childName}
            node={childNode}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            createFile={createFile}
            createFolder={createFolder}
            renameNode={renameNode}
            deleteNode={deleteNode}
            moveNode={moveNode}
          />
        ))}
    </div>
  );
}

export default function CodeEditorIDE({ user }) {
  const [project, setProject] = useState({
    project_name: "MyApp",
    license: "",
    files: {
      src: {
        components: {
          "Example.jsx": "export default () => <h2>Nested Example</h2>;",
        },
        "App.jsx": "import React from 'react';\nexport default function App() { return <h1>Hello World!</h1>; }",
        "index.jsx": "import ReactDOM from 'react-dom';\nimport App from './App';\nReactDOM.render(<App />, document.getElementById('root'));",
      },
      public: { "index.html": "<div id='root'></div>" },
    },
  });

  const [selectedFile, setSelectedFile] = useState("src/App.jsx");
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState([]);

  // 🔹 Utility for nested traversal
  const traverseTo = (obj, pathParts) => {
    let current = obj;
    for (const part of pathParts) {
      if (!current[part]) current[part] = {};
      current = current[part];
    }
    return current;
  };

  const getFileContent = (path) => path.split("/").reduce((acc, p) => acc[p], project.files);

  const updateFileContent = (path, content) => {
    const parts = path.split("/");
    setProject((prev) => {
      const clone = structuredClone(prev.files);
      let current = traverseTo(clone, parts.slice(0, -1));
      current[parts.at(-1)] = content;
      return { ...prev, files: clone };
    });
  };

  const createFile = (folderPath, fileName) => {
    setProject((prev) => {
      const clone = structuredClone(prev.files);
      traverseTo(clone, folderPath.split("/"))[fileName] = "";
      return { ...prev, files: clone };
    });
  };

  const createFolder = (folderPath, newFolderName) => {
    setProject((prev) => {
      const clone = structuredClone(prev.files);
      traverseTo(clone, folderPath.split("/"))[newFolderName] = {};
      return { ...prev, files: clone };
    });
  };

  const renameNode = (path, newName) => {
    const parts = path.split("/");
    setProject((prev) => {
      const clone = structuredClone(prev.files);
      const parent = traverseTo(clone, parts.slice(0, -1));
      parent[newName] = parent[parts.at(-1)];
      delete parent[parts.at(-1)];
      return { ...prev, files: clone };
    });
    if (selectedFile === path) setSelectedFile(parts.slice(0, -1).concat(newName).join("/"));
  };

  const deleteNode = (path) => {
    const parts = path.split("/");
    setProject((prev) => {
      const clone = structuredClone(prev.files);
      const parent = traverseTo(clone, parts.slice(0, -1));
      delete parent[parts.at(-1)];
      return { ...prev, files: clone };
    });
    if (selectedFile === path) setSelectedFile("");
  };

  const moveNode = (fromPath, toFolderPath) => {
    const fromParts = fromPath.split("/");
    const fileName = fromParts.pop();
    const toParts = toFolderPath.split("/");
    setProject((prev) => {
      const clone = structuredClone(prev.files);
      const fromParent = traverseTo(clone, fromParts.slice(0, -1));
      const toParent = traverseTo(clone, toParts);
      toParent[fileName] = fromParent[fileName];
      delete fromParent[fileName];
      return { ...prev, files: clone };
    });
  };

  const runProject = () => {
    try {
      setErrors([]);
      let combinedCode = "";
      const traverse = (folder) => {
        for (const key in folder) {
          if (typeof folder[key] === "string" && key.endsWith(".jsx")) {
            combinedCode += folder[key] + "\n";
          } else if (typeof folder[key] === "object") traverse(folder[key]);
        }
      };
      traverse(project.files);

      const transpiled = Babel.transform(combinedCode, {
        presets: ["react", "env"],
      }).code;

      const html = `
        <html>
          <head><meta charset="UTF-8" /></head>
          <body>
            <div id="root"></div>
            <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script>${transpiled}</script>
          </body>
        </html>
      `;
      const blob = new Blob([html], { type: "text/html" });
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (err) {
      setErrors([err.message]);
    }
  };

  // 🔹 Updated saveProject: no license check
  const saveProject = async () => {
    try {
      const supabase = await initSupabase();
      const { error } = await supabase
        .from("user_projects")
        .upsert([
          {
            owner_id: user.id,
            project_name: project.project_name,
            license: project.license || "",
            files: project.files,
          },
        ]);
      if (error) console.error(error);
      else alert("✅ Project saved!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save project.");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", height: "100vh" }}>
        {/* File Tree */}
        <div style={{ width: "260px", borderRight: "1px solid #555", padding: "10px", overflowY: "auto" }}>
          <input
            placeholder="License"
            value={project.license}
            onChange={(e) => setProject({ ...project, license: e.target.value })}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          {Object.entries(project.files).map(([name, node]) => (
            <TreeNode
              key={name}
              path={name}
              name={name}
              node={node}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              createFile={createFile}
              createFolder={createFolder}
              renameNode={renameNode}
              deleteNode={deleteNode}
              moveNode={moveNode}
            />
          ))}
          <button onClick={saveProject} style={{ marginTop: "10px" }}>💾 Save Project</button>
          <button onClick={runProject} style={{ marginTop: "10px" }}>▶ Run</button>
          {errors.length > 0 && (
            <div style={{ color: "red", marginTop: "10px" }}>
              {errors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )}
        </div>

        {/* Editor + Preview */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {selectedFile && (
            <MonacoEditor
              height="50%"
              language="javascript"
              theme="vs-dark"
              value={getFileContent(selectedFile)}
              onChange={(value) => updateFileContent(selectedFile, value)}
            />
          )}
          <iframe
            title="preview"
            sandbox="allow-scripts"
            src={previewUrl}
            style={{ width: "100%", height: "50%", border: "none" }}
          />
        </div>
      </div>
    </DndProvider>
  );
}
