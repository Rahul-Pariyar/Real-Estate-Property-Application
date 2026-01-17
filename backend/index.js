import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import cors from 'cors'
import DBconnection from './config/dbConnection.js'
import authRoute from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import propertyRoute from './routes/property.route.js'
import notificationRoute from './routes/notification.route.js'
import contactRoute from './routes/contact.route.js'
import cookieParser from 'cookie-parser'
import path from 'path'

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin:["http://localhost:5173", "http://192.168.0.13:5173"],
  credentials:true,
  methods:["PUT","POST","DELETE","GET","PATCH"]
}))
app.use('/uploads',express.static(path.join(__dirname,'uploads')));

DBconnection()

app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/property', propertyRoute)
app.use('/notification', notificationRoute);
app.use('/contact', contactRoute);

const PORT = process.env.PORT
app.listen(PORT, '0.0.0.0',()=>{
  console.log(`App is listening to ${PORT} PORT`)
})
