-- CreateTable
CREATE TABLE "Stripe" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stripe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stripe_orderId_key" ON "Stripe"("orderId");

-- AddForeignKey
ALTER TABLE "Stripe" ADD CONSTRAINT "Stripe_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
