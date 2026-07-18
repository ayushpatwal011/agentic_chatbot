import mongoose from "mongoose";

const artifacts = new mongoose.Schema({
	id: Number,
	type: String,
	title: String,
	files:[
		{
			name: String,
			content: String,
		}
	]
},{ _id : false})

const messageSchema = new mongoose.Schema({
	conversationId : {
		type : mongoose.Schema.Types.ObjectId,
		ref : "Conversataion"
	},
	role:{
		type: String,
		enum: ['user', 'assistant']
	},
	content: String,
	images: [String],
	artifacts: [artifacts],
	

}, { timestamps: true})

const Message = mongoose.model("Message", messageSchema)
export default Message;