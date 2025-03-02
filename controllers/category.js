import Category from '../models/category.js';

const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({sucess:true ,categories});
    } catch (error) {
       res.status(500).json( { sucess:false, message:'failed to retrive category', error: error.message});
    }
}

export {getAllCategory};