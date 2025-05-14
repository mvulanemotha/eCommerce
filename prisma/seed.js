const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  // Category list
  const categories = [
    { name: "Choose Category" },
    { name: "Electronics" },
    { name: "Fashion" },
    { name: "Home & Kitchen" },
    { name: "Beauty & Personal Care" },
    { name: "Health & Fitness" },
    { name: "Toys & Games" },
    { name: "Books & Stationery" },
    { name: "Automotive" },
    { name: "Sports & Outdoors" },
    { name: "Groceries" },
    { name: "Pet Supplies" },
    { name: "Baby & Kids" },
    { name: "Office Supplies" },
    { name: "Industrial & Scientific" },
    { name: "Arts & Crafts" },
    { name: "Digital Products" },
    { name: "Travel & Luggage" },
    { name: "Musical Instruments" },
    { name: "Collectibles" },
    { name: "Specialty Foods" },
    { name: "Subscription Boxes" },
    { name: "Services" },
    { name: "Seasonal" },
    { name: "Clearance & Sale" },
    { name: "Custom & Handmade" },
  ];

  const existingUser = await prisma.user.findFirst(); // helps check if a database has been initilised 

  if(existingUser){
    console.log("Data seeding has occured ...")
    return
  }

  // Create categories using createMany
  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true, // avoid duplicate inserts if already seeded
  });

  console.log("Categories created!");

  // Create user
  const user = await prisma.user.create({
    data: {
      email: "boymotsa@gmail.com",
      password: await bcrypt.hash("Mvulane2@@12345", 10),
      name: "Mkhululi Motha",
      country: "Eswatini",
      mobile: "+26876431551",
      role: "ADMIN",
    },
  });

  console.log("User Created:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
