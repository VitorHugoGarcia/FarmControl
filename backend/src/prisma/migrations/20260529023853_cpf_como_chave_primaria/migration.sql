/*
  Warnings:

  - The primary key for the `Balconista` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Balconista` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Balconista" DROP CONSTRAINT "Balconista_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Balconista_pkey" PRIMARY KEY ("CPF");
