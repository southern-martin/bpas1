-- Add password column and unique index on email
ALTER TABLE "User" ADD COLUMN "password" TEXT;
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
