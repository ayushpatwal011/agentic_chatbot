import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  artifacts:[]
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
        setMessages:( state, action)=>{
            state.messages = action.payload
        },
        addMessage:( state, action) =>{
            state.messages.push(action.payload)
        },
        setArtifacts:( state, action) =>{
            state.artifacts = action.payload
        },

  },
});

export const {
    setMessages, addMessage, setArtifacts
} = messagesSlice.actions;

export default messagesSlice.reducer;