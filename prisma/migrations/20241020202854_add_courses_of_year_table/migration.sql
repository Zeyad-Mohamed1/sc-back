-- CreateTable
CREATE TABLE "CoursesOfYear" (
    "id" TEXT NOT NULL,
    "yearId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CoursesOfYear_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CoursesOfYear" ADD CONSTRAINT "CoursesOfYear_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursesOfYear" ADD CONSTRAINT "CoursesOfYear_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
