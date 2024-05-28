
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";
import { instance } from "../server.js";
import ErrorHandler from "../utils/errorHandler.js";
import crypto from "crypto";

// controllers/paymentController.js
export const buySubscription = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  if (user.purchasedCourses.includes(courseId)) {
    return next(new ErrorHandler("You have already subscribed to this course", 400));
  }

  const subscription = await razorpayInstance.subscriptions.create({
    plan_id: process.env.RAZORPAY_PLAN_ID,
    customer_notify: 1,
    total_count: 12,
  });

  user.subscription = {
    id: subscription.id,
    status: subscription.status,
  };
  user.purchasedCourses.push(courseId);  // Add courseId to purchasedCourses

  await user.save();

  res.status(201).json({
    success: true,
    subscriptionId: subscription.id,
  });
});

// controllers/paymentController.js
export const paymentVarification = catchAsyncError(async (req, res, next) => {
    const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id, courseId } = req.body;
  
    if (!courseId) {
      return next(new ErrorHandler("courseId is required", 400));
    }
  
    const user = await User.findById(req.user._id);
    const subscription_id = user.subscription.id;
  
    try {
      const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
        .update(razorpay_payment_id + "|" + subscription_id, "utf-8")
        .digest("hex");
  
      const isAuthentic = generated_signature === razorpay_signature;
  
      if (!isAuthentic) return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);
  
      // Save payment information to the database
      await Payment.create({ razorpay_payment_id, razorpay_signature, razorpay_subscription_id});
  
      // ... rest of your code (user subscription update, success response)
    } catch (error) {
      console.error("Error verifying payment:", error);
      return next(new ErrorHandler("Internal server error", 500));
    }
  });
  
  
export const getRazorpayKey = catchAsyncError(async(req, res, next)=>{
    res.status(200).json({
        success:true,
        key:process.env.RAZORPAY_API_KEY,
    });
});

export const cancelSubscription = catchAsyncError(async(req, res, next)=>{
    const user = await User.findById(req.user._id);
    console.log("User Document:", user);
    const subscriptionId = user.subscription.id;
    if (!subscriptionId) {
        return next(new ErrorHandler("User does not have an active subscription", 400));
      }
    let refund = false;
    await instance.subscriptions.cancel(subscriptionId);
    const payment = await Payment.findOne({razorpay_subscription_id: subscriptionId});
    console.log("Payment Document:", payment);

    const gap = Date.now()- payment.createdAt;
    const refundTime = process.env.REFUND_DAYS * 24 * 60 * 60 * 1000;
    if(refundTime > gap){
       await instance.payments.refund(payment.razorpay_payment_id);
       refund = true;
    }
    console.log("Refund Status:", refund);

    await payment.deleteOne();
    user.subscription.id= undefined;
    user.subscription.status = undefined;
    await user.save();
    res.status(200).json({
        success:true,
        message:
        refund?"Subscription cancelled, You will receive full refund within 7 days.":
        "Subscription cancelled, Now refund intiated as subscription was cancelled after 7 days.",
    });
});
