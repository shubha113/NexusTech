import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { buySubscription, cancelSubscription, getRazorpayKey, paymentVarification } from "../controllers/paymentController.js";

const router = express.Router();

//buy subscription
router.route("/subscribe/:courseId").get(isAuthenticated, buySubscription);
//payment verification
router.route("/paymentverification").post(isAuthenticated, paymentVarification)
//verify payment and save reference in database
router.route("/razorpaykey").get(getRazorpayKey);
//cancel subscription
router.route("/subscribe/cancel/:courseId").delete(isAuthenticated, cancelSubscription);
export default router;
