/*
  Warnings:

  - Changed the type of `max_day` on the `Jorney` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Jorney" DROP COLUMN "max_day",
ADD COLUMN     "max_day" INTEGER NOT NULL;
