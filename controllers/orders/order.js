const { PrismaClient, OrderStatus } = require("@prisma/client");
const prisma = new PrismaClient();

const placeOrder = async (req , res) => {
  try {
    const  orderItems  = req.body.cartItem;
    const userId = req.user.userId;

    let totalAmount = 0;
    
    orderItems.forEach(el => {
       
       totalAmount += parseFloat(el["price"])

    });

    console.log(totalAmount) 

    // check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId, // decoded from the token
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Resource Not Found" });
    }

    //validate order items
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must have atleast one item" });
    }

    // check if each product exists and has enough stock
    const productUpdates = [];
    for (const item of orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res
          .status(400)
          .json({ error: `Product with ID ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Not enough stock for product: ${product.name}. Available stock: ${product.stock}`,
        });
      }

      // Prepare stock update for later (batch processing)
      productUpdates.push({
        id: item.productId,
        newStock: product.stock - item.quantity,
      });
    }

    //create the order
    const newOrder = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status: OrderStatus.PENDING,
        orderItems: {
          create: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },

      include: { orderItems: true }, // Include order items in the response
    });

    //update the product stock after order is created
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};


module.exports = { placeOrder  }





/*

 // Create an order for the user
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalAmount: 2300.0,
      status: "PENDING",
      orderItems: {
        create: [
          {
            productId: product1.id,
            quantity: 1,
            price: product1.price,
          },
          {
            productId: product2.id,
            quantity: 2,
            price: product2.price,
          },
        ],
      },
    },
  });

*/
