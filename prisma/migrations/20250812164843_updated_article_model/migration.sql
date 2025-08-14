/*
  Warnings:

  - The `source` column on the `Article` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `content` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ARTICLESTATUS" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."Article" ADD COLUMN     "accuracy" INTEGER DEFAULT 0,
ADD COLUMN     "articleStatus" "public"."ARTICLESTATUS" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "reasoning" TEXT,
ADD COLUMN     "summary" TEXT,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "thumbnail" TEXT,
ADD COLUMN     "title" TEXT NOT NULL,
DROP COLUMN "source",
ADD COLUMN     "source" TEXT[];
