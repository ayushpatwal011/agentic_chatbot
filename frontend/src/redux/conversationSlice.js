import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversation: [],
  selectedConversation : null
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    addConversation: (state, action) => {
      state.conversation.unshift(action.payload);
    },
    setConversation: (state, action) => {
      state.conversation = action.payload;
    },
    setSelectedConversation: (state, action)=>{
      state.selectedConversation  = action.payload;
    },
    setConvTitle: (state, action) =>{
      const {conversationId, title} = action.payload
      state.conversation = state.conversation.map((c) => c._id === conversationId ? { ...c, title } : c)
      if (state.selectedConversation?._id === conversationId) {
        state.selectedConversation.title = title;
      }
    }
  },
});

export const { setConversation , addConversation , setSelectedConversation , setConvTitle } = conversationSlice.actions;

export default conversationSlice.reducer;
