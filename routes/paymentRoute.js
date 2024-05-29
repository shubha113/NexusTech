import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { buySubscription, cancelSubscription, getRazorpayKey, paymentVarification } from "../controllers/paymentController.js";

const router = express.Router();

router.route("/subscribe/:courseId").get(isAuthenticated, buySubscription);
router.route("/paymentvarification").post(isAuthenticated, paymentVarification);
router.route("/razorpaykey").get(getRazorpayKey);
router.route("/subscribe/cancel/:courseId").delete(isAuthenticated, cancelSubscription);

export default router;
