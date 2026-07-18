import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({

	title:{
		type: String, 
		default: "New Chat"
	},
	userId: String
}, { timestamps: true})

const Conversataion = mongoose.model("Conversataion", conversationSchema)
export default Conversataion;