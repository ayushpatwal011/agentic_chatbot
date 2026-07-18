import express from "express";
import dotenv from "dotenv"
dotenv.config();
import {connetDB} from './config/db.js'
import router from "./routes/chat.route.js";

const app = express();
app.use(express.json())
const PORT = process.env.PORT

router
app.use('/', router)

app.get('/', (req,res)=>{
	res.send('Chat service is running')
})

app.listen(PORT, ()=>{
	console.log('Chat service is running at ', PORT)
	connetDB()
})