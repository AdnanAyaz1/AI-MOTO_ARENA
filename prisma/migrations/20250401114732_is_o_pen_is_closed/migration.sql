/*
  Warnings:

  - You are about to drop the column `isOpen` on the `WorkingHour` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "WorkingHour_isOpen_idx";

-- AlterTable
ALTER TABLE "WorkingHour" DROP COLUMN "isOpen",
ADD COLUMN     "isClosed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "WorkingHour_isClosed_idx" ON "WorkingHour"("isClosed");
