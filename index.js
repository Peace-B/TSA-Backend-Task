 import express from 'express'
 import morgan from 'morgan'
 import dotenv from 'dotenv'
 import mongoose from 'mongoose'
 import productRouter from "./src/routes/product.js"


 const app = express();
 app.use(express.json());
 dotenv.config()
 app.use(morgan("dev"))

 //ROUTES
app.use("/api/product", productRouter)

 //database
 const dbUrl = process.env.MONGODB_URL
 console.log(dbUrl);

 //connect to db
 const connect = (url) => {
   mongoose.connect(url)
   .then(()=> console.log('DB connected successfuly'))
   .catch(err => console.log("Error connecting to DB", err))
 }

 connect(dbUrl)

 const port = process.env.PORT;
 
 app.listen(port, () => {
    console.log(`server listening on port ${port}`)
 })