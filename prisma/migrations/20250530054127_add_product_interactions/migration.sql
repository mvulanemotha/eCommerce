/*
  Warnings:

  - You are about to drop the `ProductLikesViews` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('LIKE', 'VIEW');

-- DropForeignKey
ALTER TABLE "ProductLikesViews" DROP CONSTRAINT "ProductLikesViews_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductLikesViews" DROP CONSTRAINT "ProductLikesViews_userId_fkey";

-- DropTable
DROP TABLE "ProductLikesViews";

-- CreateTable
CREATE TABLE "ProductInteraction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "type" "InteractionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductInteraction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductInteraction" ADD CONSTRAINT "ProductInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductInteraction" ADD CONSTRAINT "ProductInteraction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
