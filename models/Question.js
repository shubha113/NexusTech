import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title:{
        type: String,
        required:[true, "Please enter course title"],
        minLength:[4,"Title must be of atleast 4 characters"],
    },
     
    content:{
        type:mongoose.Schema.Types.Mixed,
        required:[true, 'Please enter course content'],
        minLength:[10, "Content must be of atleast 10 characters"]
    },

})
export const Question = mongoose.model("Question", schema);