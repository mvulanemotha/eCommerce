const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Deleting all data...");

    // Deleting data while considering foreign key constraints (order matters)
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();

    console.log("All data deleted successfully.");
  } catch (error) {
    console.error("Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
main();
