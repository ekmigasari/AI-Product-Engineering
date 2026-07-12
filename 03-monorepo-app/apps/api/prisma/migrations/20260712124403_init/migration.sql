-- CreateTable
CREATE TABLE "CustomerResearch" (
    "id" SERIAL NOT NULL,
    "targetMarket" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "location" TEXT DEFAULT 'Indonesia',
    "additionalInfo" TEXT,
    "isDone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CustomerResearch_pkey" PRIMARY KEY ("id")
);
