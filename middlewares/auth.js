import jwt from 'jsonwebtoken';
import { catchAsyncError } from './catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';
import { User } from '../models/User.js';

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Not Logged In", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);

    if (!req.user) {
      // If user not found, consider it unauthorized
      return next(new ErrorHandler("Not Logged In", 401));
    }

    next();
  } catch (error) {
    // Token verification failed
    return next(new ErrorHandler("Not Logged In", 401));
  }
});

export const authorizeAdmin = catchAsyncError(async (req, res, next) => {
    if(req.user.role !== "admin")
     return next(new ErrorHandler(`${req.user.role} is not allowed to access this resource`, 403));
    next();
  });

  export const authorizeSubscribers = catchAsyncError(async (req, res, next) => {
    if(req.user.role !== "admin" && req.user.subscription.status !== "active")
     return next(new ErrorHandler("Only Subscribers can access this resource", 403));
    next();
  });