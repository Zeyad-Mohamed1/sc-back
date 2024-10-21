-- DropIndex
DROP INDEX "Course_name_key";

-- CreateIndex
CREATE INDEX "Course_name_idx" ON "Course"("name");
