// middlewares/courseAccess.js
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";

export const courseAccessMiddleware = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const courseId = req.params.id;

  if (user.accessibleCourses.includes(courseId)) {
    next();
  } else {
    return next(new ErrorHandler("Access Denied", 403));
  }
});
