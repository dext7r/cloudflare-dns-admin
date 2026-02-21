-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VIEWER');

-- CreateTable
CREATE TABLE "dns_users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dns_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dns_cf_accounts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "encryptedToken" TEXT NOT NULL,
    "lastTestAt" TIMESTAMP(3),
    "lastTestStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dns_cf_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dns_user_cf_accounts" (
    "userId" TEXT NOT NULL,
    "cfAccountId" TEXT NOT NULL,

    CONSTRAINT "dns_user_cf_accounts_pkey" PRIMARY KEY ("userId","cfAccountId")
);

-- CreateIndex
CREATE UNIQUE INDEX "dns_users_email_key" ON "dns_users"("email");

-- AddForeignKey
ALTER TABLE "dns_user_cf_accounts" ADD CONSTRAINT "dns_user_cf_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "dns_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dns_user_cf_accounts" ADD CONSTRAINT "dns_user_cf_accounts_cfAccountId_fkey" FOREIGN KEY ("cfAccountId") REFERENCES "dns_cf_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
