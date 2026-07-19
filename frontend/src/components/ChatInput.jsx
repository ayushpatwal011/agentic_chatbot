import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Send,
  MessageSquare,
  Code,
  Presentation,
  FileText,
  Globe,
  Sparkles,
  Loader2,
  Zap,
  X,
  Plus,
} from "lucide-react";
import {
  addConversation,
  setConvTitle,
  setSelectedConversation,
} from "../redux/conversationSlice";
import { createConversation } from "../features/createConversation";
import { updateConversation } from "../features/updateConversation";
import { sendMessage } from "../features/sendMessage";
import { addMessage, setArtifacts } from "../redux/messageSlice";

const ChatInput = ({ inputText, setInputText, loading, setLoading }) => {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const [activeAgent, setActiveAgent] = useState("auto");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileRef = useRef();

  const handleRemoveFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setSelectedFile(null);
    setFilePreview(null);
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  const agents = [
    {
      id: "auto",
      label: "Auto",
      icon: <Zap className="w-3.5 h-3.5" />,
      activeColor:
        "text-white bg-blue-600 border-white",
    },
    {
      id: "chat",
      label: "Chat",
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      activeColor:
        "text-sky-600 bg-sky-50 border-sky-200",
    },
    {
      id: "search",
      label: "Search",
      icon: <Globe className="w-3.5 h-3.5" />,
      activeColor:
        "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      id: "coding",
      label: "Coding",
      icon: <Code className="w-3.5 h-3.5" />,
      activeColor:
        "text-sky-600 bg-sky-50 border-sky-200",
    },
    {
      id: "ppt",
      label: "PPT",
      icon: <Presentation className="w-3.5 h-3.5" />,
      activeColor:
        "text-violet-600 bg-violet-50 border-violet-200",
    },
    {
      id: "pdf",
      label: "PDF",
      icon: <FileText className="w-3.5 h-3.5" />,
      activeColor:
        "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      id: "vision",
      label: "Image",
      icon: <Sparkles className="w-3.5 h-3.5" />,
      activeColor:
        "text-rose-600 bg-rose-50 border-rose-200",
    },
  ];

  const getPlaceholder = () => {
    if (!selectedConversation)
      return "Select or create a conversation to message...";
    switch (activeAgent) {
      case "coding":
        return "Ask a coding question or paste code to debug...";
      case "ppt":
        return "Ask to generate slides or outline a presentation...";
      case "pdf":
        return "Upload a document and ask questions about its content...";
      case "search":
        return "Search the web for news, latest facts, or research...";
      case "vision":
        return "Describe the image you want to generate...";
      default:
        return "Message Homework AI...";
    }
  };

  const handleSend = async () => {
    const message = inputText.trim();

    if (!message || loading) return;

    try {
      setLoading(true);

      let conversation = selectedConversation;

      // Create conversation if needed
      if (!conversation) {
        dispatch(setMessages([]));

        conversation = await createConversation();

        dispatch(addConversation(conversation));
        dispatch(setSelectedConversation(conversation));
      }

      // Update title only for new chat
      if (conversation.title === "New Chat") {
        const title = message.slice(0, 40);

        await updateConversation({
          id: conversation._id || conversation.id,
          title,
        });

        dispatch(
          setConvTitle({
            conversationId: conversation._id || conversation.id,
            title,
          }),
        );
      }

      const formData = new FormData();

      formData.append("prompt", message);
      formData.append("conversationId", conversation._id || conversation.id);
      formData.append("agent", activeAgent);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      // Add user message immediately
      dispatch(
        addMessage({
          role: "user",
          content: message,
        }),
      );
      setInputText("");

      const response = await sendMessage(formData);

      dispatch(setArtifacts(response?.artifacts || []));

      dispatch(
        addMessage({
          role: "assistant",
          content: response?.answer || "",
          images: response?.images || [],
        }),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      setSelectedFile(null);
      setFilePreview(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pt-3 px-3 pb-12 md:pt-5 md:px-5 md:pb-12  flex-shrink-0">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col bg-gray-200 border border-black rounded-xl p-2.5 focus-within:border-zinc-350 focus-within:shadow-xs transition-all duration-150 relative">
          {selectedFile && (
            <div className="flex items-center gap-3 p-2 mb-2 bg-white border border-zinc-200 rounded-lg group hover:border-zinc-300 transition-all font-inter">
              <div className="relative flex items-center justify-center w-10 h-10 rounded bg-zinc-100 overflow-hidden border border-zinc-200 flex-shrink-0">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileText className="w-5 h-5 text-black" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-zinc-900 font-mono mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-1 rounded-md text-zinc-900 transition-all duration-150 cursor-pointer"
                title="Remove File"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Agent selectors */}
          <div className="flex items-center gap-1 pb-2 px-1 border-b border-zinc-200 font-inter overflow-x-auto scrollbar-none flex-nowrap whitespace-nowrap">
            {agents.map((agent) => {
              const isSelected = activeAgent === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() =>
                    selectedConversation && setActiveAgent(agent.id)
                  }
                  disabled={!selectedConversation}
                  className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold border transition-all duration-150 ${
                    !selectedConversation
                      ? "opacity-30 cursor-not-allowed border-transparent text-zinc-400"
                      : isSelected
                        ? `${agent.activeColor} border`
                        : "text-zinc-555 border-transparent hover:text-zinc-800 hover:bg-zinc-100/50"
                  } cursor-pointer`}
                >
                  {agent.icon}
                  <span>{agent.label}</span>
                </button>
              );
            })}
          </div>

          {/* Text Area and Send controls */}
<div className="w-full flex items-end gap-2">
  <textarea
    rows={2}
    value={inputText}
    onChange={(e) => setInputText(e.target.value)}
    onKeyDown={handleKeyDown}
    disabled={!selectedConversation || loading}
    placeholder={getPlaceholder()}
    className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-black placeholder-zinc-450 text-base md:text-xs py-2 px-1 max-h-32 resize-none scrollbar-none disabled:cursor-not-allowed font-inter"
  />

  <div className="flex items-center gap-1 pb-1">
    <input
      type="file"
      accept=".pdf, image/*"
      ref={fileRef}
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          setSelectedFile(file);
          if (file.type.startsWith("image/")) {
            const previewUrl = URL.createObjectURL(file);
            setFilePreview(previewUrl);
          } else {
            setFilePreview(null);
          }
        }
      }}
      className="hidden"
    />

    <button
      disabled={!selectedConversation || loading}
      className="p-1.5 rounded-lg  bg-zinc-900 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      title="Attach File"
      onClick={() => fileRef.current.click()}
    >
      <Plus className="w-5  h-5 text-white " />
    </button>

    <button
      onClick={handleSend}
      disabled={!selectedConversation || !inputText.trim() || loading}
      className={`p-2 rounded-lg transition-all duration-150 flex items-center justify-center cursor-pointer ${
        !selectedConversation || !inputText.trim() || loading
          ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
          : "bg-zinc-900 hover:bg-zinc-800 text-white font-bold shadow-xs active:scale-[0.98]"
      }`}
      title="Send Message"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Send className="w-4 h-4" />
      )}
    </button>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
