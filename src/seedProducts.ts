import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI as string;

const products: any[] = [];

/* ------------------- TSHIRTS (15) ------------------- */
for (let i = 1; i <= 15; i++) {
  products.push({
    name: `Aurazy Premium Tee ${i}`,
    oldPrice: 1199,
    newPrice: 899,
    image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    stock: "in",
    type: "tshirt",
    newness: Math.floor(Math.random() * 5),
    bestSelling: Math.floor(Math.random() * 5),
    description: "Premium quality streetwear t-shirt",
    sizes: ["S", "M", "L", "XL"],
  });
}


/* ------------------- JEANS (10) ------------------- */
for (let i = 1; i <= 10; i++) {
  products.push({
    name: `Aurazy Slim Jeans ${i}`,
    oldPrice: 2199,
    newPrice: 1799,
    image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    stock: "in",
    type: "jeans",
    newness: Math.floor(Math.random() * 5),
    bestSelling: Math.floor(Math.random() * 5),
    description: "Slim fit stretch denim",
    sizes: ["30", "32", "34", "36"],
  });
}


/* ------------------- HOODIES (10) ------------------- */
for (let i = 1; i <= 10; i++) {
  products.push({
    name: `Aurazy Oversized Hoodie ${i}`,
    oldPrice: 1499,
    newPrice: 1099,
    image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    stock: "in",
    type: "hoodie",
    newness: Math.floor(Math.random() * 5),
    bestSelling: Math.floor(Math.random() * 5),
    description: "Premium cotton oversized hoodie",
    sizes: ["S", "M", "L", "XL"],
  });
}


const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");

    await Product.deleteMany(); // Fresh clean database
    await Product.insertMany(products);

    console.log("🔥 35 Products Inserted Successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();

 