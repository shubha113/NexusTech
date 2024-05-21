import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title:{
        type: String,
        required:[true, "Please enter course title"],
        minLength:[4,"Title must be of atleast 4 characters"],
        maxLength:[80, "Title can't exceed 80 characters"],
    },
     
    content:{
        type:String,
        required:[true, 'Please enter course content'],
        minLength:[20, "Content must be of atleast 20 characters"]
    },
    
    category:{
        type:String,
        required:true,
    },
})
export const Tutorial = mongoose.model("Lecture", schema);