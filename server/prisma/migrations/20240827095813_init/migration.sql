/*
  Warnings:

  - Changed the type of `genre` on the `Movie` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Genre" AS ENUM ('ACTION', 'DRAMA', 'COMEDY', 'HORROR', 'SCI_FI', 'ROMANCE', 'THRILLER', 'DOCUMENTARY');

-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "rating" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "genre",
ADD COLUMN     "genre" "Genre" NOT NULL;
