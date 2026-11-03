-- AlterTable
ALTER TABLE "product" ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "product_userId_idx" ON "product"("userId");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
