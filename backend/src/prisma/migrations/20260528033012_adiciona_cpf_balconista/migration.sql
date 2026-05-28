/*
  Warnings:

  - Added the required column `CPF` to the `Balconista` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Balconista" ADD COLUMN     "CPF" TEXT NOT NULL;
