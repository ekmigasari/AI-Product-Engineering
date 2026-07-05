-- CreateTable
CREATE TABLE "Research" (
    "id" SERIAL NOT NULL,
    "jobLevel" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "additionalInfo" TEXT,

    CONSTRAINT "Research_pkey" PRIMARY KEY ("id")
);
