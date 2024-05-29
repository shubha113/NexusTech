
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Course } from "../models/Course.js";
import { Payment } from "../models/Payment.js";
import { User } from "../models/User.js";
import { instance } from "../server.js";
import ErrorHandler from "../utils/errorHandler.js";
import crypto from "crypto";

export const buySubscription = catchAsyncError(async (req, res, next) => {
  console.log("User ID:", req.user.id); // Log user ID
  console.log("Course ID:", req.params.courseId); // Log course ID
  
  try {
    const user = await User.findById(req.user.id).populate("subscription.courseId");
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    if (!course) {
      console.error("Course not found for ID:", courseId);
      return next(new ErrorHandler("Course not found", 404));
    }

    if (user.subscription.some(sub => sub.courseId.toString() === courseId)) {
      console.error("User has already subscribed to the course:", courseId);
      return next(new ErrorHandler("You have already subscribed to this course", 400));
    }

    const subscription = await instance.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
      total_count: 12,
    });

    user.subscription.push({
      courseId: courseId,
      subscriptionId: subscription.id,
      status: subscription.status,
    });

    await user.save();

    res.status(201).json({
      success: true,
      subscriptionId: subscription.id,
    });
  } catch (error) {
    console.error("Error in buySubscription controller:", error); // Log error
    next(error);
  }
});



export const paymentVarification = catchAsyncError(async (req, res, next) => {
  const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id, courseId } = req.body;

  if (!courseId) {
    return next(new ErrorHandler("courseId is required", 400));
  }

  const user = await User.findById(req.user._id);
  const subscription = user.subscription.find(sub => sub.subscriptionId === razorpay_subscription_id);

  if (!subscription) {
    return next(new ErrorHandler("Subscription not found", 404));
  }

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(razorpay_payment_id + "|" + subscription.subscriptionId, "utf-8")
    .digest("hex");

  const isAuthentic = generated_signature === razorpay_signature;

  if (!isAuthentic) return res.redirect(`${process.env.FRONTEND_URL}/paymentfail`);

  await Payment.create({ razorpay_payment_id, razorpay_signature, razorpay_subscription_id });

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
  });
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
