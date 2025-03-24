import mongoose from "mongoose";
import dotenv from 'dotenv'
export async function dbconnect(){
    try {
        const connection=await mongoose.connect(process.env.MONGO_URI as string)
        if(connection.connection.readyState===1){
            console.log('Database is connected')
        }
        else{
            console.log('Database is not conneted')
        } 
    } catch (error) {
        console.log(error.message)
    }
}