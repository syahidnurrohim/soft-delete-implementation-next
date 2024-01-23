/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "University" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Student" (
    "uuid" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_university_id_fkey" FOREIGN KEY ("university_id") REFERENCES "University"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
