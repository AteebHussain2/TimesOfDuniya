-- CreateEnum
CREATE TYPE "TYPE" AS ENUM ('TOPIC_GENERATION', 'ARTICLE_GENERATION');

-- CreateEnum
CREATE TYPE "TRIGGER" AS ENUM ('MANUAL', 'CRON');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'QUEUED');

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "type" "TYPE" NOT NULL,
    "trigger" "TRIGGER" NOT NULL DEFAULT 'MANUAL',
    "status" "STATUS" NOT NULL DEFAULT 'QUEUED',
    "totalItems" INTEGER NOT NULL DEFAULT 0,
    "completedItems" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" SERIAL NOT NULL,
    "jobId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "source" TEXT,
    "published" TIMESTAMP(3),
    "status" "STATUS" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "topicId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
