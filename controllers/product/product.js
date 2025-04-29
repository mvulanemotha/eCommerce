const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const saveNewProduct = async (req, res) => {
  //
  try {
    const { name, description, price, stock, catagoryName } = req.body;

    //validate required fields
    console.log(req.body);
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

    console.log(req.user.userId);
    //create a new product
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        categoryId: category.id,
        userId: req.user.userId,
        images: {
          create: req.files.map((file) => ({
            url: `${process.env.SERVER_URL}/images/${file.filename}`,
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

//get all products
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        images: true,
        category: true,
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// get products for a user
const userProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        userId: req.user.userId,
      },
      include: {
        category: true,
        images: true,
        owner: true,
      },
    });

    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

//get a product based on product id
const getSingleProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.status(200).json({ product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//update product
const updateproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;

    const updateProduct = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        description,
        price: parseFloat(price),
      },
    });

    return res.status(200).json(updateProduct);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

// get searched product
const searchedProduct = async (req, res) => {
  try {
    console.log(req.params.value);
    const product = await prisma.product.findMany({
      where: {
        name: {
          contains: req.params.value,
          mode: "insensitive",
        },
      },
      include: {
        images: true,
        category: true,
        owner: true,
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  saveNewProduct,
  getProducts,
  userProducts,
  getSingleProduct,
  updateproduct,
  searchedProduct,
};
