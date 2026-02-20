-- AlterTable
ALTER TABLE "conversion_events"
ADD COLUMN "eventId" TEXT,
ADD COLUMN "sourceUrl" TEXT,
ADD COLUMN "ipAddress" TEXT,
ADD COLUMN "userAgent" TEXT,
ADD COLUMN "sentToMeta" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "sentToGa4" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "metaLastSentAt" TIMESTAMP(3),
ADD COLUMN "ga4LastSentAt" TIMESTAMP(3),
ADD COLUMN "attemptCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lastAttemptAt" TIMESTAMP(3),
ADD COLUMN "lastError" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "conversion_events_eventId_key" ON "conversion_events"("eventId");

-- CreateIndex
CREATE INDEX "conversion_events_sentToMeta_sentToGa4_idx" ON "conversion_events"("sentToMeta", "sentToGa4");
