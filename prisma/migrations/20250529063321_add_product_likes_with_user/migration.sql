/*
  Warnings:

  - You are about to drop the column `likes` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "likes",
DROP COLUMN "views";

-- CreateTable
CREATE TABLE "ProductLikesViews" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductLikesViews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductLikesViews_userId_productId_key" ON "ProductLikesViews"("userId", "productId");

-- AddForeignKey
ALTER TABLE "ProductLikesViews" ADD CONSTRAINT "ProductLikesViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductLikesViews" ADD CONSTRAINT "ProductLikesViews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
