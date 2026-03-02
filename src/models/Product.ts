import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  oldPrice: number;
  newPrice: number;
  image: string;
  stock: 'in' | 'out';
  type: string;
  newness: number;
  bestSelling: number;
  description?: string;
  sizes?: string[];
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    image: { type: String, required: true },
    stock: { type: String, enum: ['in', 'out'], default: 'in' },
    type: { type: String, required: true },
    newness: { type: Number, default: 0 },
    bestSelling: { type: Number, default: 0 },
    description: { type: String },
    sizes: { type: [String], default: ['S', 'M', 'L', 'XL'] },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);
export default Product;
