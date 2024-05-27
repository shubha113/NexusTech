import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Question } from "../models/Question.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createQuestion = catchAsyncError(async (req, res, next) => {
    const { title, content} = req.body;
  
    if (!title || !content)
      return next(new ErrorHandler("Please add all fields", 400));
  
    await Question.create({
      title,
      content,
    });
  
    res.status(201).json({
      success: true,
      message: "Question Created Successfully.",
    });
  });


  export const deleteQuestion = catchAsyncError(async (req, res, next) => {
    const { id } = req.params; 
  
    const question = await Question.findById(id);
  
    if (!question) {
      return next(new ErrorHandler("Question not found", 404));
    }
  
    await Question.findByIdAndDelete(id);
  
    res.status(200).json({
      success: true,
      message: "Question Deleted Successfully",
    });
  });
  

  export const getQuestion = catchAsyncError(async (req, res, next) => {
    const questions = await Question.find();
  
    if (!questions || questions.length === 0) {
      return next(new ErrorHandler("No questions found", 404));
    }
  
    res.status(200).json({
      success: true,
      questions,
    });
  });
  