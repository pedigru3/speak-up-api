/*
  Warnings:

  - You are about to drop the column `content` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `url` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "content",
ADD COLUMN     "url" TEXT NOT NULL;
