import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema(
    {
      name: {
        type: String,
        trim: true,
        required: true,
      },
      slug: {
        type: String,
        lowercase: true,
      },
      description: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        trim: true,
        required: true,
      },
      quantity: {
        type: Number,
      },
      images: [{
        url: {
          type: String,
        },
        imagePublicId: {
          type: String,
        }
      }], 
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
    { timestamps: true }
  );
  
  export default mongoose.model("Product", productSchema);


  