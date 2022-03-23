-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_parent_id_fkey";

-- CreateTable
CREATE TABLE "comments_mentioned" (
    "comment_id" TEXT NOT NULL,
    "user_custom_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "comments_mentioned_pkey" PRIMARY KEY ("comment_id","user_custom_id")
);

-- CreateTable
CREATE TABLE "comments_notifications" (
    "id" TEXT NOT NULL,
    "comment_id" TEXT,
    "sender" TEXT,
    "receiver" TEXT,
    "sender_name" TEXT,
    "receiver_name" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "comments_notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_mentioned" ADD CONSTRAINT "comments_mentioned_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_notifications" ADD CONSTRAINT "comments_notifications_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
