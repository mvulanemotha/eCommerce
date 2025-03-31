const { PrismaClient, OrderStatus } = require("@prisma/client");
const prisma = new PrismaClient();
const Orders = require("../../models/ordersSetter")

const orderInstance = new Orders()

const placeOrder = async (req, res) => {
  try {
    const orderItems = req.body.cartItem;
    const userId = req.user.userId;

    let totalAmount = 0;

    orderItems.forEach((el) => {
      totalAmount += parseFloat(el["price"]);
    });

    // check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId, // decoded from the token
      },
    });

    if (!user) {
      //return res.status(404).json({ error: "Resource Not Found" });
      return "Resource Not Found";
    }

    //validate order items
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      /*return res
        .status(400)
        .json({ error: "Order must have atleast one item" });*/
      return "Order must have atleast one item";
    }

    // check if each product exists and has enough stock
    const productUpdates = [];
    for (const item of orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
      });

      if (!product) {
        /*return res
          .status(400)
          .json({ error: `Product with ID ${item.productId} not found` }); */
        return `Product with ID ${item.productId} not found`;
      }

      if (product.stock < item.quantity) {
        /* return res.status(400).json({
          error: `Not enough stock for product: ${product.name}. Available stock: ${product.stock}`,
        });*/
        return `Not enough stock for product: ${product.name}. Available stock: ${product.stock}`;
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
            productId: item.id,
            quantity: item.count,
            price: item.price,
          })),
        },
      },

      include: { orderItems: true }, // Include order items in the response
    });

    //console.log(newOrder.orderItems[0].orderId);
    //const savedOders = new  
    orderInstance.orderId = newOrder.orderItems[0].orderId

    console.log(orderInstance.orderId)

    //update the product stock after order is created
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.count,
          },
        },
      });
    }

    /*res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });*/

    return "NONE";
  } catch (error) {
    console.log(error.message);
    // res.status(500).json({ error: error.message });
    return error.message;
  }
};

// list my orders
const myOrders = async (userId , res) => {
  try {
    // Fetch the orders for a specific user
    const orders = await prisma.order.findMany({
      where: {
        userId: userId, // Filter by the user ID
      },
      include: {
        orderItems: {
          include: {
            product: true, // Include the product details for each order item
          },
        },
      },
    });


    return res.status(200).json(orders); // Return the orders (optional if you want to use the data elsewhere)
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return res.status(500).json({ error : error.message })
  }
};


module.exports = { placeOrder , myOrders , orderInstance };
