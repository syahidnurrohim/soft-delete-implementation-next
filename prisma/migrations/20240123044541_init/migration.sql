-- CreateTable
CREATE TABLE "Bin" (
    "uuid" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,
    "row" JSONB NOT NULL,

    CONSTRAINT "Bin_pkey" PRIMARY KEY ("uuid")
);
