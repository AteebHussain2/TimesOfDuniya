-- AlterTable
ALTER TABLE "public"."Job" ALTER COLUMN "trigger" SET DEFAULT 'CRON';

-- AlterTable
ALTER TABLE "public"."UsageMetric" ALTER COLUMN "trigger" SET DEFAULT 'CRON';
