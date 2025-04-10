/*
  Warnings:

  - You are about to drop the column `make` on the `Car` table. All the data in the column will be lost.
  - Added the required column `company` to the `Car` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Car_make_model_idx";

-- AlterTable
ALTER TABLE "Car" DROP COLUMN "make",
ADD COLUMN     "company" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Car_company_model_idx" ON "Car"("company", "model");
