import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Sparkles, X, Copy, Check } from "lucide-react";
import Editor from "@monaco-editor/react";

const Artfact = ({ isOpen, onClose }) => {
  const { artifacts } = useSelector((state) => state.message);
  
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // The active artifact is the latest one
  const activeArtifact = artifacts && artifacts.length > 0 ? artifacts[0] : null;
  const hasFiles = activeArtifact && activeArtifact.files && activeArtifact.files.length > 0;

  // Safeguard chosen index
  const fileIndex = hasFiles && selectedFileIndex < activeArtifact.files.length ? selectedFileIndex : 0;
  const selectedFile = hasFiles ? activeArtifact.files[fileIndex] : null;

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageFromFilename = (filename) => {
    if (!filename) return "plaintext";
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "html":
        return "html";
      case "css":
        return "css";
      case "json":
        return "json";
      case "py":
        return "python";
      case "md":
        return "markdown";
      default:
        return "plaintext";
    }
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 lg:relative flex flex-col h-screen lg:h-full bg-white border-l border-zinc-200 transition-all duration-300 ease-in-out overflow-hidden flex-shrink-0 ${
          isOpen
            ? "w-80 lg:w-96 translate-x-0 opacity-100"
            : "w-80 lg:w-0 translate-x-full lg:translate-x-0 lg:opacity-0 lg:pointer-events-none lg:border-l-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-zinc-200 flex-shrink-0 font-inter">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Sparkles className="w-4 h-4 text-zinc-550 flex-shrink-0" />
            <div className="min-w-0 flex flex-col">
              <h3 className="text-xs font-bold text-zinc-900 truncate" title={activeArtifact?.title || "Assets Panel"}>
                {activeArtifact?.title || "Assets Panel"}
              </h3>
              <span className="text-[9px] text-zinc-450 font-bold">
                {hasFiles ? `${activeArtifact.files.length} files` : "No active project"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-455 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Collapse Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 flex flex-col p-4 min-h-0 bg-zinc-50/40 overflow-hidden font-inter">
          {!hasFiles ? (
            <div className="flex-1 flex items-center justify-center text-xs text-zinc-400 font-bold">
              No active project files yet.
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 text-left">
              {/* File list header */}
              <div className="text-[10px] font-bold text-zinc-450 uppercase tracking-wider mb-2 select-none">
                Project Files
              </div>
              
              {/* File selector tabs representing files from backend */}
              <div className="flex flex-wrap gap-1.5 flex-shrink-0 mb-3 max-h-24 overflow-y-auto pb-1">
                {activeArtifact.files.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`py-1.5 px-3 text-[10px] font-bold rounded border transition-all cursor-pointer ${
                      fileIndex === idx
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-xs"
                        : "bg-white text-zinc-650 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-800"
                    }`}
                  >
                    {file.name}
                  </button>
                ))}
              </div>

              {/* File Editor Display */}
              {selectedFile ? (
                <div className="flex-1 flex flex-col border border-zinc-200 rounded-lg overflow-hidden bg-white min-h-0 relative shadow-sm">
                  {/* Toolbar Header */}
                  <div className="flex justify-between items-center px-3 h-8.5 bg-zinc-100 border-b border-zinc-200/80 flex-shrink-0">
                    <span className="text-[10px] font-mono text-zinc-650 font-bold truncate pr-3">
                      {selectedFile.name}
                    </span>
                    <button
                      onClick={() => handleCopy(selectedFile.content)}
                      className="text-[9px] px-2 py-0.5 rounded border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50 flex items-center gap-1 cursor-pointer transition-colors font-bold"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>

                  {/* Monaco Editor Component */}
                  <div className="flex-1 min-h-0 w-full relative">
                    <Editor
                      height="100%"
                      language={getLanguageFromFilename(selectedFile.name)}
                      theme="light"
                      value={selectedFile.content}
                      options={{
                        minimap: { enabled: false },
                        wordWrap: "on",
                        lineNumbers: "on",
                        fontSize: 11,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        readOnly: true,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center border border-dashed border-zinc-200 rounded-lg text-zinc-450 text-xs bg-zinc-50 font-bold">
                  File content is empty or unavailable
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Artfact;