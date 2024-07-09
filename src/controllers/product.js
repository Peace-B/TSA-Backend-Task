import Product from "../models/product.js";
import { cloudinary } from "../helpers/cloudinary.config.js";
import slugify from "slugify";


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const imageFiles = req.files;

    if (!name || !description || !price || !quantity) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const slug = slugify(name);
    let uploadedImages = [];

    if (imageFiles && imageFiles.length > 0) {
      uploadedImages = await Promise.all(
        imageFiles.map(async (file) => {
          try {
            const imageResult = await cloudinary.uploader.upload(file.path);
            return {
              url: imageResult.secure_url,
              imagePublicId: imageResult.public_id,
            };
          } catch (err) {
            console.error("Error uploading image to Cloudinary:", err);
            return {
              error: "Failed to upload image",
            };
          }
        })
      );
    }

    const newProduct = new Product({
      name,
      slug,
      description,
      price,
      quantity,
      images: uploadedImages,
    });

    await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ success: false, message: "Failed to create product", error: err });
  }
};


  export const getOneProduct = async(req, res)=>{
    try {
        const { productId }= req.params;
        const product = await Product.findById({_id: productId})
    if(!product){
          res.status(404).json({success: false, message: 'Product not found'})
        }
    res.json({success: true, message: 'product retrieved successfully', product})
    } catch (err) {
      console.log("", err.message);
        res.status(500).json({message: false, message: err.message});
    }
}

export const getAllProducts = async(req, res) => {
  try {
      const product = await Product.find()
     res.json({success: true, message: "Products fetched successfully", product})
 } catch (err) {
   res.status(500).json({success: false, message: err.message})
 }
}



export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price, category, quantity } = req.body;
    const imageFiles = req.files;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
   
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.quantity = quantity || product.quantity;

    if(name){
      const nameSlug = slugify(name)
      product.slug =  nameSlug || product.slug;

    }

    // Delete previously uploaded images from Cloudinary
    if (product.images && product.images.length > 0) {
      await Promise.all(
        product.images.map(async (image) => {
          try {
            // Delete image from Cloudinary
            await cloudinary.uploader.destroy(image.imagePublicId);
          } catch (err) {
            console.error("Error deleting image from Cloudinary:", err);
          }
        })
      );
    }

    // Upload new images to Cloudinary
    let uploadedImages = [];

    if (imageFiles && imageFiles.length > 0) {
      uploadedImages = await Promise.all(
        imageFiles.map(async (file) => {
          try {
            const imageResult = await cloudinary.uploader.upload(file.path);
            return {
              url: imageResult.secure_url,
              imagePublicId: imageResult.public_id,
            };
          } catch (err) {
            console.error("Error uploading image to Cloudinary:", err);
            return {
              error: "Failed to upload image",
            };
          }
        })
      );
    }

    product.images = uploadedImages.length > 0 ? uploadedImages : product.images;

    // Save updated product
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: product,
    });
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ success: false, message: "Error updating product", error: err.message });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: `Product ID: ${productId} deleted successfully `});
  } catch (err) {
    console.error("Error deleting product by ID:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete product", error: err.message });
  }
};
