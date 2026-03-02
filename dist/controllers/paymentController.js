"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = exports.createRazorpayOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const Order_1 = __importDefault(require("../models/Order"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});
const createRazorpayOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalPrice } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, error: 'No items in order' });
        }
        // 1. Create Order in MongoDB
        const order = new Order_1.default({
            items,
            shippingAddress,
            totalPrice,
            status: 'pending',
        });
        const savedOrder = await order.save();
        // 2. Create Razorpay Order
        const options = {
            amount: Math.round(totalPrice * 100), // amount in the smallest currency unit (paise)
            currency: 'INR',
            receipt: `receipt_${savedOrder._id}`,
        };
        const razorpayOrder = await razorpay.orders.create(options);
        // 3. Update MongoDB Order with razorpayOrderId
        savedOrder.razorpayOrderId = razorpayOrder.id;
        await savedOrder.save();
        res.status(201).json({
            success: true,
            orderId: savedOrder._id,
            razorpayOrder,
        });
    }
    catch (error) {
        console.error('Create Order Error:', error);
        res.status(500).json({ success: false, error: 'Failed to create payment order' });
    }
};
exports.createRazorpayOrder = createRazorpayOrder;
const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body.toString())
            .digest('hex');
        const isSignatureValid = expectedSignature === razorpay_signature;
        if (isSignatureValid) {
            // Payment Successful
            await Order_1.default.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, {
                status: 'paid',
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                paidAt: new Date(),
            });
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        }
        else {
            // Payment Verification Failed
            await Order_1.default.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: 'failed' });
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    }
    catch (error) {
        console.error('Verify Payment Error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
exports.verifyPayment = verifyPayment;
//# sourceMappingURL=paymentController.js.map