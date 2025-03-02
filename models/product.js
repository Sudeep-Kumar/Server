import mongoose, {Schema} from 'mongoose';


const ProductSchema = new Schema({
  name: { type: String, required: true},
  image_uri: { type: String, required: true},
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  price: { type: Number, required: true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;