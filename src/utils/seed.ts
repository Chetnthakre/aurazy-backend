import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import Product from '../models/Product';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedProducts = [
  {
    name: "Jodha Peplum Kurti – A Jaipur Dream",
    oldPrice: 1299,
    newPrice: 499,
    image: "/assets/IMG_2689.PNG",
    stock: "in",
    type: "hoodies",
    newness: 1,
    bestSelling: 20,
    description: "A beautiful kurti inspired by Jaipur traditions."
  },
  {
    name: "Cocoa Short V-neck Kurti",
    oldPrice: 1499,
    newPrice: 699,
    image: "/assets/IMG_2690.PNG",
    stock: "in",
    type: "coats",
    newness: 2,
    bestSelling: 15,
    description: "Elegant and comfortable for any occasion."
  },
  {
    name: "Classic Tee",
    oldPrice: 899,
    newPrice: 399,
    image: "/assets/IMG_2692.PNG",
    stock: "in",
    type: "tees",
    newness: 3,
    bestSelling: 10,
    description: "Your everyday essential."
  },
  {
    name: "Pink Floral Kurti",
    oldPrice: 1299,
    newPrice: 499,
    image: "/assets/IMG_2689.PNG",
    stock: "in",
    type: "hoodies",
    newness: 4,
    bestSelling: 5,
    description: "Soft floral patterns for a refreshing look."
  },
  {
    name: "Blue Denim Jacket",
    oldPrice: 1999,
    newPrice: 999,
    image: "/assets/IMG_2690.PNG",
    stock: "in",
    type: "coats",
    newness: 5,
    bestSelling: 30,
    description: "Durable and stylish denim."
  },
  {
    name: "White Summer Dress",
    oldPrice: 1599,
    newPrice: 799,
    image: "/assets/IMG_2692.PNG",
    stock: "out",
    type: "tees",
    newness: 6,
    bestSelling: 2,
    description: "Perfect for hot summer days."
  },
  {
    name: "Embroidered Top",
    oldPrice: 1299,
    newPrice: 599,
    image: "/assets/IMG_2689.PNG",
    stock: "in",
    type: "hoodies",
    newness: 7,
    bestSelling: 8,
    description: "Detailed embroidery work."
  },
  {
    name: "Black Parka",
    oldPrice: 2499,
    newPrice: 1299,
    image: "/assets/IMG_2690.PNG",
    stock: "in",
    type: "coats",
    newness: 8,
    bestSelling: 12,
    description: "Stay warm in style."
  },
  {
    name: "Grey Sweatshirt",
    oldPrice: 1199,
    newPrice: 599,
    image: "/assets/IMG_2692.PNG",
    stock: "in",
    type: "tees",
    newness: 9,
    bestSelling: 18,
    description: "Cozy and comfortable."
  },
  {
    name: "Silk Kurta",
    oldPrice: 2999,
    newPrice: 1499,
    image: "/assets/IMG_2689.PNG",
    stock: "out",
    type: "hoodies",
    newness: 10,
    bestSelling: 25,
    description: "Luxury silk fabric."
  },
];

const seedData = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    await User.deleteMany({});

    await Product.insertMany(seedProducts);

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123456', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash,
      isAdmin: true,
    });
    
    const regularUser = await User.create({
        name: 'Regular User',
        email: 'user@example.com',
        passwordHash,
        isAdmin: false,
    });

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
