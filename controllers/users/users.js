const { PrismaClient, UserRole } = require("@prisma/client");
const prisma = new PrismaClient();

//update user to admin
const updateUserRole = async (req, res) => {
  const userId = req.user.userId;

  try {
    const update = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: UserRole.ADMIN,
      },
    });

    if (update) {
      return res.status(201).json({ message: "Updated Successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { updateUserRole };
