import React, { useEffect, useState } from "react";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import { getMessages } from "../features/getMessages";
import { setMessages, setArtifacts } from "../redux/messageSlice";
import { useDispatch, useSelector } from "react-redux";

const ChatArea = () => {
  const dispatch = useDispatch();

  const { selectedConversation } = useSelector((state) => state.conversation);

  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    const getMsg = async () => {
      if(!selectedConversation?._id || selectedConversation.title === "New Chat") {
        dispatch(setMessages([]));
        dispatch(setArtifacts([]));
        return;
      }
      const data = await getMessages(selectedConversation?._id);
      dispatch(setMessages(data))
      const latestArtifactMessage = [...data].reverse().find(msg => msg.artifacts && msg.artifacts.length > 0);
      dispatch(setArtifacts(latestArtifactMessage?.artifacts || []));
    }
    getMsg();
  },[selectedConversation?._id])


  return (
    <div className="flex-1 bg-white flex flex-col h-full relative overflow-hidden">
      <MessageList
        onSuggestionClick={setInputText}
        loading={loading}
      />

      <ChatInput
        inputText={inputText}
        setInputText={setInputText}
        loading={loading}
        setLoading={setLoading}
      />
    </div>
  );
};

export default ChatArea;