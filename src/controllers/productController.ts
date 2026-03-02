import { Request, Response } from 'express';
import Product from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, oldPrice, newPrice, image, stock, type, newness, bestSelling, description, sizes } = req.body;

    const product = new Product({
      name,
      oldPrice,
      newPrice,
      image,
      stock,
      type,
      newness,
      bestSelling,
      description,
      sizes,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, oldPrice, newPrice, image, stock, type, newness, bestSelling, description, sizes } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.oldPrice = oldPrice || product.oldPrice;
      product.newPrice = newPrice || product.newPrice;
      product.image = image || product.image;
      product.stock = stock || product.stock;
      product.type = type || product.type;
      product.newness = newness || product.newness;
      product.bestSelling = bestSelling || product.bestSelling;
      product.description = description || product.description;
      product.sizes = sizes || product.sizes;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
