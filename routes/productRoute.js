const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const products = require("../controllers/product/product");
const upload = require("../middleware/uploadMiddleware");
const prisma = new PrismaClient();
const verifyToken = require("../middleware/authTokens")

//create product
router.post("/create", verifyToken.verifyToken , upload.array("images", 3), async (req, res) => {
  //console.log(req.user.userId)
  await products.saveNewProduct(req, res);
});


// delete a product
router.delete("/:id", verifyToken.verifyToken , async (req, res) => {
  try {
    // product
    const productId = parseInt(req.query.id);
    console.log(productId);
    //check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product Not Found" });
    }

    // check if no orders related exists
    const relatedOrders = await prisma.orderItem.findFirst({
      where: { productId },
    });

    if (relatedOrders) {
      return res.status(400).json({
        error: "Product has oders already",
      });
    }

    const deleteProduct = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

  
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

//get all products from database
router.get("/all", async (req, res) => {
  await products.getProducts(req, res);
});

//get all products for a specific user
router.get("/myproducts" , verifyToken.verifyToken , products.userProducts)

//get product based on id
router.get("/:id" , verifyToken.verifyToken , products.getSingleProduct )

//update customer product
router.put("/:id" , verifyToken.verifyToken , products.updateproduct)

// get searched product
router.get('/search/:value' , products.searchedProduct)

module.exports = router;
