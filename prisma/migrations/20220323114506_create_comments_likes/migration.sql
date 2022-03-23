-- CreateTable
CREATE TABLE "comments_likes" (
    "comment_id" TEXT NOT NULL,
    "user_custom_id" TEXT NOT NULL,
    "user_name" TEXT,

    CONSTRAINT "comments_likes_pkey" PRIMARY KEY ("comment_id","user_custom_id")
);

-- AddForeignKey
ALTER TABLE "comments_likes" ADD CONSTRAINT "comments_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
