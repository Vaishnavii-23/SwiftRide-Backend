-- CreateTable
CREATE TABLE "SurgeZone" (
    "id" TEXT NOT NULL,
    "zoneId" TEXT NOT NULL,
    "surgeMulti" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "demandCount" DOUBLE PRECISION NOT NULL,
    "supplyCount" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SurgeZone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SurgeZone_zoneId_key" ON "SurgeZone"("zoneId");
