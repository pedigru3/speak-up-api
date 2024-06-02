/*
  Warnings:

  - You are about to drop the `Jorney` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jorney_day` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Presence" DROP CONSTRAINT "Presence_jorney_day_id_fkey";

-- DropForeignKey
ALTER TABLE "jorney_day" DROP CONSTRAINT "jorney_day_jorney_id_fkey";

-- DropTable
DROP TABLE "Jorney";

-- DropTable
DROP TABLE "jorney_day";

-- CreateTable
CREATE TABLE "Journey" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "max_day" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journey_day" (
    "id" TEXT NOT NULL,
    "journey_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "current_progress" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "journey_day_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "journey_day" ADD CONSTRAINT "journey_day_journey_id_fkey" FOREIGN KEY ("journey_id") REFERENCES "Journey"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presence" ADD CONSTRAINT "Presence_jorney_day_id_fkey" FOREIGN KEY ("jorney_day_id") REFERENCES "journey_day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
