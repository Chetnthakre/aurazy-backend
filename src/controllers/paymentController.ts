import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order';
import Product from '../models/Product';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const createRazorpayOrder = async (req: Request, res: Response) => {
  try {
    console.log("Incoming Data:", req.body);

    const { items, shippingAddress, totalPrice } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }

    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ success: false, error: "Product not found" });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.image,
        price: product.newPrice,
        quantity: item.quantity
      });
    }

    const order = new Order({
      items: orderItems,
      shippingAddress,
      totalPrice,
      status: 'pending',
    });

    const savedOrder = await order.save();

    const options = {
      amount: Math.round(totalPrice * 100),
      currency: 'INR',
      receipt: `receipt_${savedOrder._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    savedOrder.razorpayOrderId = razorpayOrder.id;
    await savedOrder.save();

    res.status(201).json({
      success: true,
      orderId: savedOrder._id,
      razorpayOrder,
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, error: 'Failed to create payment order' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          status: 'paid',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paidAt: new Date(),
        }
      );

      res.status(200).json({ success: true });
    } else {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );

      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

  } catch (error) {
    console.error('Verify Payment Error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};