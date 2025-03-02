import Razorpay from "razorpay";
import Order from "../models/order.js";
import Transaction from "../models/transaction.js";
const createTransaction= async (req, res) => {
    const {amount,userId}=req.body;
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const payment_capture = 1;
    const currency = "INR";
    const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_order_${userId}`,
        payment_capture,
    };

    try {
        if(!userId||!amount){
            return res.status(400).json({success:false, message:'userId is required'});
        }
        const razorpayOrder = await razorpay.orders.create(options);
        res.status(201).json({success:true, message:'order created',key:process.env.RAZORPAY_KEY_ID,amount:razorpayOrder.amount,currency:razorpayOrder.currency,order_id:razorpayOrder.id});
    } catch (error) {
        res.status(500).json({ success: false, message: "failed to create order", error: error.message });
    }
}

const createOrder = async (req, res) => {
    const 
    {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        userId,
        amount,
        cartItems,
        deliveryDate,
        address
    } = req.body;

    const  key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    const generated_signature = crypto.createHmac('sha256', key_secret).update(razorpay_order_id + "|" + razorpay_payment_id).digest('hex');

    if(generated_signature===razorpay_signature){
        try {
          
            const transaction = await Transaction.create({
                user: userId,
                order:razorpay_order_id,
                paymentId: razorpay_payment_id,
                amount: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
                orderId: razorpay_order_id,
                status: 'Success'
            });

            const order = await Order.create({
                user: userId,
                transaction: transaction._id,
                items:cartItems.map(item => ({
                    product: item?.product,
                    quantity: item?.quantity
                })),
                deliveryDate,
                address,
                status: 'Order Placed'
            });

            transaction.order = order._id;
            await transaction.save();

            res.json({ success: true, message: 'order created', order });


            
        } catch (error) {
            res.status(500).json({ success: false, message: 'failed to create order', error: error.message });
        }

    }

}

const getOrderByUserID= async (req, res) => {
    const { userId } = req.params;
    try {
        const orders = await Order.find({ user: userId }).populate('user', 'name email').populate('items.product', 'name price image_uri ar_uri').sort({ createdAt: -1 });
        if(orders.length === 0 || !orders) {
            return res.status(404).json({ success: false, message: 'No orders found for this user' });
        }
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'failed to retrive orders', error: error.message });
    }
}





export {createTransaction, createOrder, getOrderByUserID};