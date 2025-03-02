import mongoose, { Schema } from 'mongoose';

const ItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [ItemSchema], required: true },
  deliveryDate: { type: Date, required: true },
  address: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Order Placed', 'Shipping', 'Out for Delivery', 'Delivered', 'Cancelled'], 
    default: 'Order Placed' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Use mongoose.models.Order or create a new model
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export default Order;

