import mongoose from "mongoose";

export const connetDB = async ()=>{
	try {
		await mongoose.connect(`${process.env.MONGODB_URI}/auth`)
		console.log('DataBase conneted');
		
	} catch (e) {
		console.log('Error in connectDB', e);
		
	}
}