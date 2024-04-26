/*
  Warnings:

  - You are about to drop the column `daysInARow` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "daysInARow",
ADD COLUMN     "days_in_a_row" INTEGER NOT NULL DEFAULT 0;
