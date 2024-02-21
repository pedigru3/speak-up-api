/*
  Warnings:

  - A unique constraint covering the columns `[text]` on the table `points_categories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user';

-- CreateIndex
CREATE UNIQUE INDEX "points_categories_text_key" ON "points_categories"("text");
