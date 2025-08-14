/*
  Warnings:

  - You are about to drop the column `url` on the `Article` table. All the data in the column will be lost.
  - Added the required column `source` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Article" DROP COLUMN "url",
ADD COLUMN     "source" TEXT NOT NULL;
