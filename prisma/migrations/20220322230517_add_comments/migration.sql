-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "nama" TEXT,
    "department" TEXT,
    "status" TEXT,
    "usia" TEXT,
    "comment" TEXT,
    "user_custom_id" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "parent_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments_tags" (
    "comment_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "comments_tags_pkey" PRIMARY KEY ("comment_id","tag_id")
);

-- AddForeignKey
ALTER TABLE "comments_tags" ADD CONSTRAINT "comments_tags_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments_tags" ADD CONSTRAINT "comments_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
