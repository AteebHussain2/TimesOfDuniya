-- AlterTable
ALTER TABLE "public"."Post" ADD COLUMN     "accuracy" INTEGER DEFAULT 0,
ADD COLUMN     "articleStatus" "public"."ARTICLESTATUS" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "feedback" TEXT,
ADD COLUMN     "reasoning" TEXT,
ADD COLUMN     "source" TEXT[];
