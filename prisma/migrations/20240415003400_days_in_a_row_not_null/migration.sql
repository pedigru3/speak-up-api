/*
  Warnings:

  - Made the column `daysInARow` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "daysInARow" SET NOT NULL,
ALTER COLUMN "daysInARow" SET DEFAULT 0;
