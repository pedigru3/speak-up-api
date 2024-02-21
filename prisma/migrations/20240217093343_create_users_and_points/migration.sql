/*
  Warnings:

  - Added the required column `point_category_id` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Point" ADD COLUMN     "point_category_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_point_category_id_fkey" FOREIGN KEY ("point_category_id") REFERENCES "points_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
