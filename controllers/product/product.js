const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const saveNewProduct = async (req, res) => {
  //
  try {
    const { name, description, price, stock, catagoryName } = req.body;

    //validate required fields
    if (!name || !description || !price || !stock || !catagoryName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    //Check if the category exists
    const category = await prisma.category.findUnique({
      where: { name: catagoryName },
    });

    if (!category) {
      return res.status(400).json({ error: "Category not found" });
    }

    
    console.log(req.user.userId)
    //create a new product
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price : parseFloat(price),
        stock : parseInt(stock),
        categoryId: category.id,
        userId: req.user.userId,
        images: {
          create: req.files.map((file) => ({
            url: `/images/${file.filename}`,
          })),
        },
      },
    });

    return res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { saveNewProduct };
