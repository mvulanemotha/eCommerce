const { PrismaClient, InteractionType } = require("@prisma/client");
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
      where: {
        stock: {
          gt: 0,
        },
      },

      orderBy: {
        createdAt: "desc", // get products in  descending order
      },
      include: {
        images: true,
        category: true,
        owner: true,
        interactions: true,
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

//saveProductLike
const saveProductLike = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.userId;

  try {
    await prisma.productInteraction.create({
      data: {
        userId,
        productId: id,
        type: InteractionType.LIKE,
      },
    });

    return res.status(200).json({ message: "Like saved" });
  } catch (error) {
    if (error.code === "P2002") {
      // Unique constraint failed (already liked)
      return res.status(400).json({ error: "Product already liked" });
    }
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

//saveProductView
const saveProductView = async (req, res) => {
  const { id } = req.body;
  const userId = req.user.userId;

  try {
    await prisma.productInteraction.create({
      data: {
        userId,
        productId: id,
        type: InteractionType.VIEW,
      },
    });

    return res.status(200).json({ message: "View saved" });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Product already Viewed" });
    }
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  saveNewProduct,
  getProducts,
  userProducts,
  getSingleProduct,
  updateproduct,
  searchedProduct,
  saveProductLike,
  saveProductView,
};
