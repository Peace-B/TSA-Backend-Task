import express from "express"
import { createProduct, getAllProducts, getOneProduct, updateProduct, deleteProductById} from "../controllers/product.js"
import { upload } from "../helpers/multer.js"


const router = express.Router()

 router.post("/create", upload.array("images", 5), createProduct)
 router.get("/all", getAllProducts)
 router.get("/:productId", getOneProduct)
 router.put("/update/:productId", upload.array("images", 5), updateProduct)
 router.delete("/:productId", deleteProductById)



 export default router

