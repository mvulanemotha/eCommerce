const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  // Create Categories
  const categories = await prisma.$transaction([
    prisma.category.create({ data: { name: "Electronics" } }),
    prisma.category.create({ data: { name: "Accessories" } }),
    prisma.category.create({ data: { name: "Clothing" } }),
    prisma.category.create({ data: { name: "Home Appliances" } }),
  ]);

  console.log("Categories Created:", categories.map(c => c.name));

  // Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@com",
      password: await bcrypt.hash("Admin@123", 10),
      name: "Admin User",
      country: "USA",
      mobile: "+1234567890",
      role: "ADMIN",
    },
  });

  console.log("Admin User Created:", adminUser.email);

  // List of products with real image URLs
  const productsData = [
    { name: "Laptop", description: "Powerful laptop", price: 1500.0, stock: 10, categoryId: categories[0].id, imageUrl: "https://source.unsplash.com/400x300/?laptop" },
    { name: "Smartphone", description: "High-end smartphone", price: 1000.0, stock: 15, categoryId: categories[0].id, imageUrl: "https://source.unsplash.com/400x300/?smartphone" },
    { name: "Headphones", description: "Noise-cancelling headphones", price: 150.0, stock: 20, categoryId: categories[1].id, imageUrl: "https://source.unsplash.com/400x300/?headphones" },
    { name: "T-Shirt", description: "Cotton t-shirt", price: 25.0, stock: 50, categoryId: categories[2].id, imageUrl: "https://source.unsplash.com/400x300/?tshirt" },
    { name: "Refrigerator", description: "Double door fridge", price: 800.0, stock: 8, categoryId: categories[3].id, imageUrl: "https://source.unsplash.com/400x300/?refrigerator" },
  ];

  // Generate 95 more products dynamically
  for (let i = 6; i <= 100; i++) {
    productsData.push({
      name: `Product ${i}`,
      description: `Description for Product ${i}`,
      price: Math.floor(Math.random() * 500) + 50, // Random price between 50 and 550
      stock: Math.floor(Math.random() * 50) + 1, // Random stock between 1 and 50
      categoryId: categories[Math.floor(Math.random() * categories.length)].id,
      imageUrl: `https://source.unsplash.com/400x300/?product,${i}`, // Unique image URL
    });
  }

  // Insert products and get their IDs
  const createdProducts = await prisma.$transaction(
    productsData.map((product) =>
      prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: product.categoryId,
          userId: adminUser.id, // Assign all products to admin
        },
      })
    )
  );

  console.log("Created Products:", createdProducts.length);

  // Insert images for each product
  await prisma.$transaction(
    createdProducts.map((product, index) =>
      prisma.image.create({
        data: {
          url: productsData[index].imageUrl,
          productId: product.id,
        },
      })
    )
  );

  console.log("Images Assigned to Products");

  console.log("Seeding Completed Successfully");
}

// Run the seed function
main()
  .catch((e) => {
    console.error("Error Seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
