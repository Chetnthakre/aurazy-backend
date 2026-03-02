"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalPrice } = req.body;
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, error: 'No order items' });
        }
        const order = new Order_1.default({
            items,
            shippingAddress,
            totalPrice,
        });
        const createdOrder = await order.save();
        res.status(201).json({
            success: true,
            data: createdOrder,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, error: error.message });
        }
        else {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
};
exports.createOrder = createOrder;
//# sourceMappingURL=orderController.js.map