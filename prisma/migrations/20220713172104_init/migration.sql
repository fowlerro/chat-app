/*
  Warnings:

  - A unique constraint covering the columns `[chatId,receiverId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification_chatId_receiverId_key" ON "Notification"("chatId", "receiverId");
