/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId,type]` on the table `ProductInteraction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductInteraction_userId_productId_type_key" ON "ProductInteraction"("userId", "productId", "type");
