import mongoose, { Document } from 'mongoose';
export interface IOrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
}
export interface IOrder extends Document {
    items: IOrderItem[];
    shippingAddress: {
        name: string;
        phone: string;
        address: string;
        city: string;
        pincode: string;
    };
    totalPrice: number;
    status: 'pending' | 'paid' | 'failed';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    paidAt?: Date;
    createdAt: Date;
}
declare const _default: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, mongoose.DefaultSchemaOptions> & IOrder & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IOrder>;
export default _default;
