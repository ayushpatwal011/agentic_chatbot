import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Sparkles,
  Code,
  Globe,
  FileText,
  Presentation,
  User,
  ExternalLink,
  Copy,
  Check,
  X,
  Download,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageList = ({ onSuggestionClick, loading }) => {
  const { messages } = useSelector((state) => state.message);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const messagesEndRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState("");
  const [activeImage, setActiveImage] = useState(null);

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);

    setTimeout(() => {
      setCopiedCode("");
    }, 2000);
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-900">
        <div className="w-10 h-10  rounded bg-zinc-900 text-white flex items-center justify-center font-bold text-lg select-none">
          HW
        </div>

        <p className="text-base md:text-sm font-bold uppercase tracking-wider mb-1">
          Select a Conversation
        </p>
        <p className="text-sm md:text-xs text-zinc-900 max-w-xs leading-normal font-medium ">
          Pick an existing chat from the sidebar or click "New Chat" to start a
          fresh workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:p-6 space-y-6 bg-white scrollbar-none">
      <div className="max-w-3xl mx-auto space-y-6 flex flex-col">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg._id || index}
              className={`flex gap-3.5 max-w-[90%] md:max-w-[85%] ${isUser ? "self-end ml-auto flex-row-reverse" : "self-start mr-auto"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 
                  border transition-all duration-150 shadow-xs bg-zinc-900 border-white text-white`}
              >
                {isUser ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div className="flex flex-col gap-1.5 w-full">
                {/* Images displayed above the bubble */}
                {msg.images && msg.images.length > 0 && (
                  <div
                    className={`flex gap-4 flex-wrap mb-2 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {msg.images.map((image, idx) => (
                      <div
                        key={idx}
                        className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm transition-all duration-200 w-72 max-w-full flex flex-col"
                      >
                        {/* Image preview wrapper */}
                        <div
                          onClick={() => setActiveImage(image)}
                          className="relative aspect-square w-full overflow-hidden cursor-zoom-in bg-zinc-100"
                        >
                          <img
                            src={image}
                            alt="Generated asset"
                            className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-center p-3">
                            <span className="text-[10px] font-bold text-white tracking-wider uppercase px-2.5 py-1 rounded-md bg-zinc-900/90 border border-zinc-700 backdrop-blur-xs shadow-sm">
                              View Full Image
                            </span>
                          </div>
                        </div>

                        {/* Image Info / Action Bar */}
                        <div className="p-2.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between gap-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-zinc-800">
                              Generated Image
                            </span>
                            <span className="text-[9px] text-zinc-450 font-semibold">
                              Expires in 24 hours
                            </span>
                          </div>
                          <a
                            href={image}
                            download={`generated-image-${idx}.png`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-850 text-white text-[10px] font-bold transition-all cursor-pointer shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`rounded-2xl px-4 py-2.5 text-lg md:text-sm leading-relaxed font-inter transition-colors duration-150 ${
                    isUser
                      ? " text-black border border-zinc-800 font-bold"
                      : " text-black border border-zinc-800"
                  }`}
                >
                  <div className="prose max-w-none text-black text-lg md:text-sm">
                    <Markdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-xl md:text-lg font-bold font-display mt-5 mb-2.5 text-black flex items-center gap-2 border-b border-zinc-200 pb-1">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg md:text-base font-bold font-display mt-4 mb-2 text-black">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-base md:text-sm font-bold font-display mt-3.5 mb-1.5 text-black">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-3 whitespace-pre-wrap break-words leading-relaxed font-inter text-lg md:text-sm">
                            {children}
                          </p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5 space-y-1 my-3 text-black font-inter text-lg md:text-sm">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-5 space-y-1 my-3 text-black font-inter text-lg md:text-sm">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="mb-0.5 leading-relaxed text-lg md:text-sm">
                            {children}
                          </li>
                        ),
                        table: ({ children }) => {
                          return (
                            <div className="overflow-x-auto my-4 rounded-lg border border-zinc-200 bg-zinc-50/50 shadow-xs font-inter text-xs">
                              <table className="min-w-full border-collapse text-left">
                                {children}
                              </table>
                            </div>
                          );
                        },
                        thead: ({ children }) => (
                          <thead className="bg-zinc-100 border-b border-zinc-200 text-black font-bold">
                            {children}
                          </thead>
                        ),
                        th: ({ children }) => (
                          <th className="px-4 py-2 border-r border-zinc-200 last:border-r-0 font-semibold text-black">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="px-4 py-2 border-t border-zinc-200 border-r border-zinc-200 last:border-r-0 text-zinc-800 bg-white/40">
                            {children}
                          </td>
                        ),
                        tr: ({ children }) => (
                          <tr className="hover:bg-zinc-100/50 transition-colors last:border-b-0 border-b border-zinc-200">
                            {children}
                          </tr>
                        ),
                        img: ({ src, alt }) => {
                          if (!src) return null;
                          return (
                            <div
                              onClick={() => setActiveImage(src)}
                              className="my-3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100/40 cursor-zoom-in max-w-md shadow-xs group relative"
                            >
                              <img
                                src={src}
                                alt={alt || "Asset"}
                                className="w-full h-auto max-h-[300px] object-contain group-hover:scale-[1.005] transition-transform duration-200"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center">
                                <span className="text-[9px] font-bold text-white uppercase tracking-wider px-2 py-1 rounded bg-zinc-900/90 border border-zinc-700 backdrop-blur-xs">
                                  View Image
                                </span>
                              </div>
                            </div>
                          );
                        },
                        code: ({ className, children }) => {
                          const value = String(children).trim();
                          const isInline =
                            !className || !className.startsWith("language-");

                          if (isInline) {
                            return (
                              <code className="px-1.5 py-0.5 rounded bg-zinc-100 text-rose-600 font-mono text-xs border border-zinc-200 font-medium">
                                {value}
                              </code>
                            );
                          }

                          const language = className.replace("language-", "");

                          return (
                            <div className="my-4 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 shadow-xs font-inter">
                              <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-100 px-4 py-2">
                                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-500 font-semibold">
                                  {language}
                                </span>
                                <button
                                  onClick={() => copyCode(value)}
                                  className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[10px] font-semibold text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50 transition-all duration-150 cursor-pointer"
                                >
                                  {copiedCode === value ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      <span className="text-emerald-600 font-bold">
                                        Copied!
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <SyntaxHighlighter
                                language={language}
                                style={vs}
                                customStyle={{
                                  margin: 0,
                                  background: "transparent",
                                  padding: "1rem",
                                  fontSize: "12px",
                                  lineHeight: "1.5",
                                }}
                                codeTagProps={{
                                  style: {
                                    fontFamily:
                                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                  },
                                }}
                              >
                                {value}
                              </SyntaxHighlighter>
                            </div>
                          );
                        },
                        a: ({ children, href }) => {
                          const isPdf =
                            href &&
                            (href.toLowerCase().includes(".pdf") ||
                              href.toLowerCase().includes("pdf-"));
                          const isPpt =
                            href &&
                            (href.toLowerCase().includes(".pptx") ||
                              href.toLowerCase().includes(".ppt") ||
                              href.toLowerCase().includes("ppt-"));

                          if (isPdf || isPpt) {
                            let displayName = isPdf
                              ? "Document.pdf"
                              : "Presentation.pptx";
                            try {
                              const urlObj = new URL(href);
                              const pathname = urlObj.pathname;
                              const parts = pathname.split("/");
                              const lastPart = parts[parts.length - 1];
                              if (
                                lastPart &&
                                (lastPart.toLowerCase().includes(".pdf") ||
                                  lastPart.toLowerCase().includes(".ppt") ||
                                  lastPart.toLowerCase().includes(".pptx"))
                              ) {
                                displayName = decodeURIComponent(lastPart);
                              }
                            } catch (e) {
                              // Fallback if URL parsing fails
                            }

                            const theme = isPdf
                              ? {
                                  bg: "bg-red-50",
                                  border: "border-red-200",
                                  text: "text-red-700",
                                  icon: <FileText className="w-5 h-5" />,
                                  label: "PDF Document • Study Asset",
                                }
                              : {
                                  bg: "bg-amber-50",
                                  border: "border-amber-200",
                                  text: "text-amber-700",
                                  icon: <Presentation className="w-5 h-5" />,
                                  label: "Presentation Deck • Study Asset",
                                };

                            return (
                              <div className="my-3 max-w-md font-inter">
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-all duration-200 shadow-xs cursor-pointer block"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div
                                      className={`w-10 h-10 rounded-lg ${theme.bg} border ${theme.border} flex items-center justify-center ${theme.text} transition-transform duration-200 flex-shrink-0`}
                                    >
                                      {theme.icon}
                                    </div>
                                    <div className="min-w-0 flex flex-col gap-0.5">
                                      <span className="text-xs font-bold text-zinc-900 group-hover:text-zinc-750 transition-colors truncate">
                                        {displayName}
                                      </span>
                                      <span className="text-[10px] text-zinc-450 font-semibold">
                                        {theme.label}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="p-2 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-500 group-hover:text-zinc-800 transition-all duration-200 flex items-center justify-center shadow-xs">
                                    <Download className="w-4 h-4" />
                                  </div>
                                </a>
                              </div>
                            );
                          }

                          // Default link behavior
                          return (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-primary hover:underline font-bold inline-flex items-center gap-0.5 transition-colors"
                            >
                              {children}
                              <ExternalLink className="w-3 h-3 inline" />
                            </a>
                          );
                        },
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-3 border-zinc-400 pl-4 my-3 italic text-zinc-650">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {msg.content}
                    </Markdown>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator using custom bounces */}
        {loading && (
          <div className="flex gap-3 max-w-[85%] self-start mr-auto">
            {/* Avatar */}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border bg-zinc-900 border-zinc-800 text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>

            {/* Bubble Loader */}
            <div className="rounded-2xl px-4 py-3 bg-zinc-50 border border-zinc-200 flex items-center gap-1.5 shadow-xs">
              <span
                className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce-custom"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce-custom"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce-custom"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Image Modal Lightbox */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-8 cursor-zoom-out animate-fade-in"
          onClick={() => setActiveImage(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/90 border border-zinc-700 text-white hover:text-red-400 transition-all cursor-pointer shadow-lg hover:scale-105"
            onClick={() => setActiveImage(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-1 flex items-center justify-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage}
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg select-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
