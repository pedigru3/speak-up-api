/*
  Warnings:

  - You are about to drop the column `date` on the `Presence` table. All the data in the column will be lost.
  - Added the required column `created_at` to the `Presence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jorney_day_id` to the `Presence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Presence" DROP COLUMN "date",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "jorney_day_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Jorney" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "max_day" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Jorney_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jorney_day" (
    "id" TEXT NOT NULL,
    "jorney_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "current_progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "jorney_day_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jorney_day" ADD CONSTRAINT "jorney_day_jorney_id_fkey" FOREIGN KEY ("jorney_id") REFERENCES "Jorney"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_jorney_day_id_fkey" FOREIGN KEY ("jorney_day_id") REFERENCES "jorney_day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
