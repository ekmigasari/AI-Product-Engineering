/*
  Warnings:

  - You are about to drop the column `jobLevel` on the `Research` table. All the data in the column will be lost.
  - Added the required column `jobTitle` to the `Research` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Research" DROP COLUMN "jobLevel",
ADD COLUMN     "jobTitle" TEXT NOT NULL;
