import mongoose from "mongoose";
import CategoryModel from "./Category.model";

const Schema = mongoose.Schema;

const shopSchema = new Schema({
  shop_cart: {
    type: String,
    required: true,
  },
  shop_name: {
    type: String,
    required: true,
  },

  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: CategoryModel,
  },

  price: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  status: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("shop product", shopSchema);
