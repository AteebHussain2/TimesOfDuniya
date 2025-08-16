/*
  Warnings:

  - The `source` column on the `Topic` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Topic" DROP COLUMN "source",
ADD COLUMN     "source" TEXT[];
