import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { buySubscription, cancelSubscription, getRazorpayKey, paymentVarification } from "../controllers/paymentController.js";

const router = express.Router();

// Buy subscription for a specific course
router.route("/subscribe/:courseId").get(isAuthenticated, buySubscription);
// Payment verification
router.route("/paymentverification").post(isAuthenticated, paymentVarification);
// Get Razorpay key
router.route("/razorpaykey").get(getRazorpayKey);
// Cancel subscription
router.route("/subscribe/cancel/:courseId").delete(isAuthenticated, cancelSubscription);

export default router;
