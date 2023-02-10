-- AlterTable
ALTER TABLE "user" ADD COLUMN     "imageUrl" TEXT DEFAULT '',
ADD COLUMN     "isActive" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "userFriend" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,

    CONSTRAINT "userFriend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "friendshipRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "isAccepted" BOOLEAN DEFAULT false,

    CONSTRAINT "friendshipRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userMessage" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "isRead" BOOLEAN DEFAULT false,

    CONSTRAINT "userMessage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userFriend" ADD CONSTRAINT "userFriend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userFriend" ADD CONSTRAINT "userFriend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendshipRequest" ADD CONSTRAINT "friendshipRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendshipRequest" ADD CONSTRAINT "friendshipRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userMessage" ADD CONSTRAINT "userMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userMessage" ADD CONSTRAINT "userMessage_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
