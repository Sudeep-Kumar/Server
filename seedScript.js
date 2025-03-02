import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/connect.js';
import Category from './models/category.js';
import Product from './models/product.js';
import {categoriesData, productData} from './seedData.js';



dotenv.config();

async function seedDataBase() {
    try {
        await connectDB(process.env.MONGO_URI);
        await Category.deleteMany({});
        await Product.deleteMany({});
        const categoryDocs =  await Category.insertMany(categoriesData);
        const categoriesMap= categoryDocs.reduce((map,category)=>{
            map[category.name]=category._id;
            return map;
        });

        const ProductWithCategoryIds= productData.map(product=>{
            return {...product,category:categoriesMap[product.category]};
        });
        await Product.insertMany(ProductWithCategoryIds);
        
        console.log('Database Seeded');
        
    } catch (err) {
        console.log(err);
    }

    finally {
       mongoose.connection.close();
    }



}

seedDataBase();