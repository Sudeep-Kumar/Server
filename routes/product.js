import express from "express";    
import { getProductByCategoryID } from "../controllers/product.js";

const router = express.Router();

//router.post("/:categoryId", getProductByCategoryID);
router.get("/:categoryId", getProductByCategoryID);

export default router;