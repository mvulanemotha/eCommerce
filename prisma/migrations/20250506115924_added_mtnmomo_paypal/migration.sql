-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYPAL', 'MTN_MOMO');

-- CreateTable
CREATE TABLE "Paypal" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "paymentId" TEXT NOT NULL,
    "payerId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paypal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MtnMoMo" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "transactionId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MtnMoMo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Paypal_orderId_key" ON "Paypal"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Paypal_paymentId_key" ON "Paypal"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "MtnMoMo_orderId_key" ON "MtnMoMo"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "MtnMoMo_transactionId_key" ON "MtnMoMo"("transactionId");

-- AddForeignKey
ALTER TABLE "Paypal" ADD CONSTRAINT "Paypal_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MtnMoMo" ADD CONSTRAINT "MtnMoMo_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
