/*
  Warnings:

  - You are about to drop the `userMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "userMessage" DROP CONSTRAINT "userMessage_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "userMessage" DROP CONSTRAINT "userMessage_senderId_fkey";

-- DropTable
DROP TABLE "userMessage";

-- CreateTable
CREATE TABLE "chat" (
    "id" TEXT NOT NULL,
    "isGroup" BOOLEAN DEFAULT false,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT DEFAULT '',

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatMessage" (
    "id" TEXT NOT NULL,
    "idChat" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "isReadBy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isReceivedBy" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "chatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatToUser_AB_unique" ON "_ChatToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatToUser_B_index" ON "_ChatToUser"("B");

-- AddForeignKey
ALTER TABLE "chatMessage" ADD CONSTRAINT "chatMessage_idChat_fkey" FOREIGN KEY ("idChat") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chatMessage" ADD CONSTRAINT "chatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD CONSTRAINT "_ChatToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD CONSTRAINT "_ChatToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
