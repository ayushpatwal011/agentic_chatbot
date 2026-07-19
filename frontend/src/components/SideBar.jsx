import React, { useEffect, useState } from "react";
import {
  Plus,
  MessageSquare,
  LogOut,
  ChevronRight,
  Search,
  Pencil,
  Check,
  X,
  LogIn,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getConversation } from "../features/getConversation";
import { setConversation, addConversation, setSelectedConversation } from "../redux/conversationSlice";
import { createConversation } from "../features/createConversation";
import { logout } from "../features/logout";
import { setUserdata } from "../redux/userSlice";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import { api } from "../utils/axios";
import { ArrowFatLineLeftIcon } from "@phosphor-icons/react";

const SideBar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const { userData } = useSelector((state) => state.user);
  const { conversation, selectedConversation } = useSelector((state) => state.conversation);
  
  useEffect(() => {
    const fetchConversations = async () => {
      const res = await getConversation();
      dispatch(setConversation(res));
    };
    fetchConversations();
  }, [userData]);

  const handleConversation = async () => {
    const data = await createConversation();
    dispatch(addConversation(data));
    dispatch(setSelectedConversation(data));
  };

  const logoutHandler = async () => {
    logout();
    dispatch(setUserdata(null));
  };

  const googleLogin = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      const token = await data.user.getIdToken();
      const { data: resData } = await api.post("/auth/login", { token });
      dispatch(setUserdata({ user: resData }));
    } catch (e) {
      console.log("error in handlelogin ", e);
    }
  };

  const handleRename = (id, currentTitle) => {
    setEditingId(id);
    setEditTitle(currentTitle || "New Chat");
  };

  const handleSaveRename = async (id) => {
    if (!editTitle.trim()) return;
    try {
      await api.post("/chat/update-conversation", {
        id,
        title: editTitle.trim(),
      });
      
      // Update local state in redux
      const updatedConversations = conversation.map((c) =>
        (c._id || c.id) === id ? { ...c, title: editTitle.trim() } : c
      );
      dispatch(setConversation(updatedConversations));

      // Also update selectedConversation if this is the active one
      if (selectedConversation && (selectedConversation._id || selectedConversation.id) === id) {
        dispatch(setSelectedConversation({ ...selectedConversation, title: editTitle.trim() }));
      }
    } catch (err) {
      console.error("Failed to rename conversation:", err);
    } finally {
      setEditingId(null);
    }
  };

  const filteredConversations = (conversation || []).filter((item) =>
    (item.title || "New Chat").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-45 bg-zinc-950/20 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 md:relative flex flex-col h-dvh md:h-full bg-zinc-50 text-zinc-800 transition-all duration-300 ease-in-out overflow-hidden border-r border-zinc-200/80 ${
          isOpen
            ? "w-64 md:w-72 translate-x-0 opacity-100"
            : "w-64 md:w-0 -translate-x-full md:translate-x-0 md:opacity-0 md:pointer-events-none md:border-r-0"
        }`}
      >
        <div className="w-64 md:w-72 flex flex-col h-full flex-shrink-0">
          
          {/* Sidebar Header with Title and Close Button */}
          <div className="h-14 px-4 border-b border-zinc-200/80 flex items-center justify-between flex-shrink-0 font-inter">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8  rounded bg-zinc-900 text-white flex items-center justify-center font-bold text-md select-none">
                HW
              </div>
              <span className="font-bold  text-zinc-900 select-none">HomeWork AI</span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-455 hover:text-zinc-800 50 cursor-pointer transition-colors duration-150 flex items-center justify-center"
              title="Close Sidebar"
            >
              <ArrowFatLineLeftIcon size={24}/>
            </button>
          </div>

          {/* New Chat Button */}
          <div className="px-4 pt-4 pb-2 font-inter">
            <button
              onClick={handleConversation}
              className="w-full flex items-center justify-between bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 rounded-lg py-2 px-3 text-base md:text-xs font-bold transition-all duration-150 cursor-pointer shadow-xs hover:shadow-sm"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-zinc-555" />
                New Chat
              </span>
              <Plus className="w-4 h-4 text-zinc-450" />
            </button>
          </div>

          {/* Search Chat Input */}
          <div className="px-4 pb-3">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 bg-white border border-zinc-200 focus:border-zinc-300 focus:outline-none rounded-lg text-base md:text-xs text-zinc-800 placeholder-zinc-400 font-inter"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 text-zinc-450 hover:text-zinc-850 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Chats list */}
          <div className="flex-1 overflow-y-auto px-3 space-y-4 scrollbar-thin">
            <div>
              <div className="px-3 mb-2 flex items-center justify-between font-inter">
                <span className="text-xs md:text-[10px] font-bold text-zinc-450 uppercase tracking-wider">
                  Recent Chats
                </span>
                {filteredConversations.length > 0 && (
                  <span className="text-[9px] font-bold text-zinc-500 bg-zinc-200/50 px-2 py-0.5 rounded-full border border-zinc-200/40">
                    {filteredConversations.length}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                {filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center px-4 font-inter">
                    <p className="text-[11px] text-zinc-400 font-bold tracking-wide">
                      {searchTerm ? "No matches found" : "No chats found"}
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((item) => {
                    const isSelected = (selectedConversation?._id || selectedConversation?.id) === (item?._id || item?.id);
                    const itemId = item._id || item.id;
                    const isEditing = editingId === itemId;

                    return (
                      <div
                        key={itemId}
                        onClick={() => {
                          if (!isEditing) {
                            dispatch(setSelectedConversation(item));
                            // Auto close sidebar on mobile when chat item is clicked
                            if (window.innerWidth < 768) {
                              onClose();
                            }
                          }
                        }}
                        className={`group relative flex items-center justify-between w-full pl-3 pr-2 py-2 rounded-lg text-base md:text-xs font-bold font-inter transition-all duration-150 text-left cursor-pointer border ${
                          isSelected
                            ? "text-zinc-900 bg-zinc-200/60 border-zinc-200 shadow-xs"
                            : "text-zinc-650 border-transparent hover:text-zinc-900 hover:bg-zinc-200/30"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <MessageSquare className={`w-4 h-4 flex-shrink-0 transition-colors duration-150 ${
                            isSelected ? "text-zinc-800" : "text-zinc-450 group-hover:text-zinc-600"
                          }`} />
                          
                          {isEditing ? (
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveRename(itemId);
                                if (e.key === "Escape") setEditingId(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-white border border-zinc-300 rounded-md px-1.5 py-0.5 text-zinc-900 text-base md:text-xs focus:outline-none focus:border-zinc-400 w-full"
                              autoFocus
                            />
                          ) : (
                            <span className="truncate pr-2 select-none">{item.title || "New Chat"}</span>
                          )}
                        </div>

                        {/* Action buttons (Rename) */}
                        {isEditing ? (
                          <div className="flex items-center gap-0.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleSaveRename(itemId)}
                              className="p-0.5 rounded hover:bg-zinc-300 text-emerald-600 cursor-pointer"
                              title="Save Title"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-0.5 rounded hover:bg-zinc-300 text-zinc-450 hover:text-zinc-700 cursor-pointer"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150" 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleRename(itemId, item.title)}
                              className="p-0.5 rounded hover:bg-zinc-300 text-zinc-450 hover:text-zinc-700 cursor-pointer"
                              title="Rename Conversation"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <ChevronRight className={`w-3.5 h-3.5 transition-all duration-150 ${
                              isSelected ? "opacity-100 text-zinc-600 translate-x-0.5" : "opacity-30"
                            }`} />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer Identity Block */}
          <div className="p-4 border-t border-zinc-200/80 bg-zinc-100/50 font-inter">
            {userData ? (
              <div className="flex items-center justify-between gap-3 p-2 rounded-lg bg-white border border-zinc-200">
                <div className="flex items-center gap-2.5 min-w-0">
                  {userData?.user?.avatar ? (
                    <img
                      src={userData?.user?.avatar}
                      alt={userData?.user?.name || "User"}
                      className="w-8 h-8 rounded-md border border-zinc-200 object-cover shadow-xs"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-900 text-white font-bold text-xs shadow-inner">
                      {(userData?.user?.name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm md:text-xs font-bold text-zinc-900 truncate leading-tight">
                      {userData?.user?.name}
                    </span>
                    <span className="text-[11px] md:text-[9px] text-zinc-450 truncate font-bold">
                      {userData?.user?.email}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logoutHandler}
                  className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-zinc-100 transition-all duration-150 cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={googleLogin}
                className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-900 text-white rounded-lg py-2.5 px-4 text-xs font-bold transition-all duration-150 cursor-pointer shadow-xs active:scale-[0.99]"
              >
                <LogIn className="w-4 h-4 text-zinc-200" />
                Log in
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
