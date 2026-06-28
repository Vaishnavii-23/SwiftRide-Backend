/*
  Warnings:

  - Added the required column `dropoffAddress` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pickupAddress` to the `Ride` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ride" ADD COLUMN     "dropoffAddress" TEXT NOT NULL,
ADD COLUMN     "pickupAddress" TEXT NOT NULL;
