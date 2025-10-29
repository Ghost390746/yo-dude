import React, { useState } from "react";
import { useSystemStore } from "../store/systemStore";

export default function Explorer({ folderContent, title }) {
  const { drives, createFolder, createFile, readFile, betas } = useSystemStore();
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  // Determine current folder content
  const getCurrentItems = () => {
    if (folderContent) return folderContent;

    let items = drives[currentPath[0] || "C"] || [];

    for (let i = 1; i < currentPath.length; i++) {
      const folder = items.find((f) => f.type === "dir" && f.name === currentPath[i]);
      items = folder?.children || [];
    }

    if (currentPath.length === 0) {
      items = [{ type: "dir", name: "Betas", children: betas }, ...items];
    }

    return items;
  };

  const handleCreateFolder = () => {
    const name = prompt("Enter folder name:");
    if (!name) return;

    const items = getCurrentItems();
    items.push({ type: "dir", name, children: [] });
    setCurrentPath([...currentPath]); // Force re-render
  };

  const handleCreateFile = () => {
    const name = prompt("Enter file name:");
    if (!name) return;
    const content = prompt("Enter initial content:") || "";

    const items = getCurrentItems();
    items.push({ type: "file", name, content });
    setCurrentPath([...currentPath]); // Force re-render
  };

  const handleOpenItem = (item) => {
    if (item.type === "dir") {
      setCurrentPath([...currentPath, item.name]);
      setSelectedFile(null);
    } else {
      setSelectedFile(item.name);
      setFileContent(item.content || readFile("C", item.name) || "");
    }
  };

  const handleBack = () => {
    if (currentPath.length > 0) setCurrentPath(currentPath.slice(0, -1));
    setSelectedFile(null);
  };

  return (
    <div className="text-white p-3 font-mono h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-2">{title || "Explorer"}</h2>

      {/* Breadcrumb */}
      <div className="mb-2 text-gray-300">
        <span
          className="cursor-pointer hover:text-green-400"
          onClick={() => setCurrentPath([])}
        >
          C:
        </span>
        {currentPath.map((folder, i) => (
          <span key={i}>
            {" / "}
            <span
              className="cursor-pointer hover:text-green-400"
              onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}
            >
              {folder}
            </span>
          </span>
        ))}
      </div>

      {/* Action buttons */}
      <div className="mb-2 flex gap-2">
        <button className="btn" onClick={handleCreateFolder}>
          📁 New Folder
        </button>
        <button className="btn" onClick={handleCreateFile}>
          📄 New File
        </button>
        {currentPath.length > 0 && (
          <button className="btn" onClick={handleBack}>
            ⬅ Back
          </button>
        )}
      </div>

      {/* File explorer grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-2">
        {getCurrentItems().map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center cursor-pointer p-2 rounded hover:bg-gray-700"
            onDoubleClick={() => handleOpenItem(item)}
          >
            <div className="text-4xl mb-1">
              {item.type === "dir" ? "📁" : "📄"}
            </div>
            <div className="text-sm text-center truncate w-full">{item.name}</div>
          </div>
        ))}
      </div>

      {/* File viewer */}
      {selectedFile && (
        <div className="bg-[#05101a] p-2 rounded overflow-auto mt-2">
          <h3 className="font-semibold mb-1">Viewing file: {selectedFile}</h3>
          <pre>{fileContent}</pre>
        </div>
      )}
    </div>
  );
}
