import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController';

const router = express.Router();

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);

export default router;
