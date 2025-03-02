import express from "express";   
import { createTransaction } from "../controllers/orders.js";
import { createOrder } from "../controllers/orders.js";
import { getOrderByUserID } from "../controllers/orders.js";




const router = express.Router();

//crate order
router.post('/transaction', createTransaction);
router.post('/', createOrder);
router.get('/:userId', getOrderByUserID);

export default router;

