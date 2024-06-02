/*
  Warnings:

  - The `icon` column on the `points_categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Icon" AS ENUM ('appointment', 'calendar', 'calendar2', 'chat', 'journey', 'onlineMeeting', 'order', 'pendingTask', 'taskList', 'toDoList');

-- AlterTable
ALTER TABLE "points_categories" DROP COLUMN "icon",
ADD COLUMN     "icon" "Icon" NOT NULL DEFAULT 'chat';
