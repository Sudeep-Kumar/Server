import mongoose, {Schema} from 'mongoose';
import Order from './order.js';

const TransactionSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    paymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    orderId: { type: String, required: true },
    status: { type: String, enum: [ 'Pending', 'Success', 'Failed' ] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Change 'Order' to 'Transaction' here
const Transaction = mongoose.model('Transaction', TransactionSchema);
export default Transaction;

