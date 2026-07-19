import express from "express";
import dotenv from "dotenv"
import {connetDB} from './config/db.js'
import router from "./routes/auth.route.js";
dotenv.config();
import './config/firebase.js'

const app = express();
app.use(express.json())
const PORT = process.env.AUTH_PORT


// router
app.use('/', router)

app.get('/', (req,res)=>{
	res.send('Auth is running')
})

app.listen(PORT, ()=>{
	console.log('Auth is running at ', PORT)
	connetDB()
})