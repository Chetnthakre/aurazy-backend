import express from 'express';
import { createOrder, getMyOrders } from '../controllers/orderController';
import { protect, optionalProtect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', optionalProtect, createOrder);
router.get('/mine', protect, getMyOrders);

export default router;
