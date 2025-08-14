/*
  Warnings:

  - You are about to drop the column `source` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "source";

-- CreateTable
CREATE TABLE "public"."Source" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Source_url_key" ON "public"."Source"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Source_url_postId_key" ON "public"."Source"("url", "postId");

-- AddForeignKey
ALTER TABLE "public"."Source" ADD CONSTRAINT "Source_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
