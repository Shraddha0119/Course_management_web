// import express from "express";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

// const app = express();
// app.use(express.json())

const PORT = process.env.PORT || 4500;

// app.get("/",(req,res)=>{
//   res.send("Welcome to our server")
// })


console.log("MONGO_URL =", process.env.MONGO_URL);

connectDB();

app.listen(PORT,()=>{
  console.log(`server is running on http://localhost:${PORT}`)
})




