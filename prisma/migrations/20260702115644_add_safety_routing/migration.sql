-- CreateEnum
CREATE TYPE "RouteType" AS ENUM ('FASTEST', 'SAFEST');

-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "routeType" "RouteType" NOT NULL DEFAULT 'FASTEST',
ADD COLUMN     "safetyScore" DOUBLE PRECISION;
