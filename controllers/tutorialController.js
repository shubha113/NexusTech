import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Tutorial } from "../models/Tutorial.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createTutorial = catchAsyncError(async (req, res, next) => {
    const { title, content, category } = req.body;
  
    if (!title || !content || !category)
      return next(new ErrorHandler("Please add all fields", 400));
  
    await Tutorial.create({
      title,
      content,
      category,
    });
  
    res.status(201).json({
      success: true,
      message: "Tutorial Created Successfully.",
    });
  });


  export const deleteTutorial = catchAsyncError(async (req, res, next) => {
    const { id } = req.params; 
  
    const tutorial = await Tutorial.findById(id);
  
    if (!tutorial) {
      return next(new ErrorHandler("Tutorial not found", 404));
    }
  
    await Tutorial.findByIdAndDelete(id);
  
    res.status(200).json({
      success: true,
      message: "Tutorial Deleted Successfully",
    });
  });
  

  export const getTutorial = catchAsyncError(async (req, res, next) => {
    const tutorials = await Tutorial.find();
  
    if (!tutorials || tutorials.length === 0) {
      return next(new ErrorHandler("No tutorials found", 404));
    }
  
    res.status(200).json({
      success: true,
      tutorials,
    });
  });
  
  // Get single tutorial by ID
  export const getSingleTutorial = catchAsyncError(async (req, res, next) => {
    const tutorial = await Tutorial.findById(req.params.id);
  
    if (!tutorial) {
      return next(new ErrorHandler("Tutorial not found", 404));
    }
  
    res.status(200).json({
      success: true,
      tutorial,
    });
  });