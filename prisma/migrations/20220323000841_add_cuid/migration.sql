/*
  Warnings:

  - The primary key for the `comments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `comments_tags` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "comments_tags" DROP CONSTRAINT "comments_tags_comment_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP CONSTRAINT "comments_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "comments_id_seq";

-- AlterTable
ALTER TABLE "comments_tags" DROP CONSTRAINT "comments_tags_pkey",
ALTER COLUMN "comment_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "comments_tags_pkey" PRIMARY KEY ("comment_id", "tag_id");

-- AddForeignKey
ALTER TABLE "comments_tags" ADD CONSTRAINT "comments_tags_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
