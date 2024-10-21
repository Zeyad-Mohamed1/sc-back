-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT;
UPDATE "User" SET "name" = (SELECT "firstName" FROM "User" WHERE "id" = "User"."id") || ' ' || (SELECT "lastName" FROM "User" WHERE "id" = "User"."id");
