const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const path = require("path");

async function main() {
  // Create Categories
  const electronicsCategory = await prisma.category.create({
    data: {
      name: "Electronics",
    },
  });

  const accessoriesCategory = await prisma.category.create({
    data: {
      name: "Accessories",
    },
  });

  console.log("Categories Created:", {
    electronicsCategory,
    accessoriesCategory,
  });

  // Create user with new attributes
  const user = await prisma.user.create({
    data: {
      email: "boymotsa@gmail.com",
      password: await bcrypt.hash("Mvulane2@@12345", 10),
      name: "Mkhululi Motha",
      country: "South Africa",
      mobile: "+27712345678",
      role: "ADMIN",
    },
  });

  console.log("User Created:", user);

  // Create products and associate them with categories
  const product1 = await prisma.product.create({
    data: {
      name: "Laptop",
      description: "A powerful laptop",
      price: 1500.0,
      stock: 10,
      categoryId: electronicsCategory.id,
      userId: user.id, // This product has an owner
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Smartphone",
      description: "A high-end smartphone",
      price: 1000.0,
      stock: 10,
      categoryId: electronicsCategory.id,
      userId: null, // This product has NO owner
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "Headphones",
      description: "Noise-cancelling headphones",
      price: 150.0,
      stock: 20,
      categoryId: accessoriesCategory.id,
      userId: null, // This product has NO owner
    },
  });

  console.log("Created Products:", { product1, product2, product3 });

  // Create local Image URLs
  // Create Images
  await prisma.image.create({
    data: { url: "http://localhost:8845/images/laptop.jpg", productId: product1.id },
  });
  await prisma.image.create({
    data: { url: "http://localhost:8845/images/smartphone.jpg", productId: product2.id },
  });
  await prisma.image.create({
    data: { url: "http://localhost:8845/images/headphones.jpg", productId: product3.id },
  });

 //console.log("Created Images:", images);

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

  console.log("Created Order:", order);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
