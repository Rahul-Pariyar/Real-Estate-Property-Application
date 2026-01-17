import mongoose from "mongoose";
async function DBconnection(){
  try{
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log("Database connected successfully!")
  }
  catch(error){
    console.log("Database connection failed",error)
    process.exit(1)
  }
}

export default DBconnection
