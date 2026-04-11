const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Helper to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @route   POST /api/payments/create-order
// @desc    Create Order
router.post(
  "/create-order",
  [
    check("amount", "Amount is required and must be a positive number").isFloat({ min: 0.01 }),
    check("courseId", "Course ID is required").not().isEmpty().trim(),
    check("userId", "User ID is required").not().isEmpty().trim(),
  ],
  validate,
  async (req, res) => {
    const { amount, courseId, userId } = req.body;

    try {
      const options = {
        amount: Math.round(amount * 100), // amount in the smallest currency unit
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      // Save initial payment record
      const newPayment = new Payment({
        orderId: order.id,
        amount: amount,
        userId: userId,
        courseId: courseId,
        status: "created",
      });

      await newPayment.save();

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Unable to create payment order" });
    }
  }
);

// @route   POST /api/payments/verify
// @desc    Verify Payment
router.post(
  "/verify",
  [
    check("razorpay_order_id", "Order ID is required").not().isEmpty().trim(),
    check("razorpay_payment_id", "Payment ID is required").not().isEmpty().trim(),
    check("razorpay_signature", "Signature is required").not().isEmpty().trim(),
  ],
  validate,
  async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

      if (razorpay_signature === expectedSign) {
        const payment = await Payment.findOne({ orderId: razorpay_order_id });
        if (payment) {
          payment.paymentId = razorpay_payment_id;
          payment.signature = razorpay_signature;
          payment.status = "success";
          await payment.save();
          
          return res.json({ message: "Payment verified successfully" });
        } else {
          return res.status(404).json({ message: "Payment record not found" });
        }
      } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
      }
    } catch (err) {
      console.error("Verification error:", err);
      return res.status(500).json({ message: "Payment verification failed" });
    }
  }
);

module.exports = router;

