-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ADMIN';

-- CreateTable
CREATE TABLE "Catagory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Catagory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Catagory_name_key" ON "Catagory"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Catagory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
