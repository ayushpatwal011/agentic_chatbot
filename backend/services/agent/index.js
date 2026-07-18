import "dotenv/config";
import express from "express";
import {connetDB} from './config/db.js'
import router from "./routers/agent.router.js";


const app = express();
app.use(express.json())
const PORT = process.env.PORT

// router
app.use('/', router)

app.use((err, req, res,next)=>{
	console.log(err);
	if(err.status){
		return res.status(err.status).json(err.data)
	}
	return res.status(500).json({message:`agent error ${err}`})
})

app.get('/', (req,res)=>{
	res.send('Agent is running')
})

app.listen(PORT, ()=>{
	console.log('Agent is running at ', PORT)
	connetDB()
})