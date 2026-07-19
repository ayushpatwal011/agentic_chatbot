import mongoose from "mongoose";

export const connetDB = async ()=>{
	try {
		await mongoose.connect(`${process.env.MONGODB_URI}/chat`)
		console.log('DataBase conneted');
		
	} catch (e) {
		console.log('Error in connectDB', e);
		
	}
}