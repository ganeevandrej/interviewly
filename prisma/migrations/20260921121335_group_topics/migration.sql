BEGIN;
-- This transition is for the verified empty initial database. Never discard category data.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "Category") OR EXISTS (SELECT 1 FROM "GroupCategory") OR EXISTS (SELECT 1 FROM "Question") OR EXISTS (SELECT 1 FROM "QuestionGroup") THEN
    RAISE EXCEPTION 'Topic migration requires an empty database; migrate existing data explicitly first';
  END IF;
END $$;
-- DropForeignKey
ALTER TABLE "GroupCategory" DROP CONSTRAINT "GroupCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "GroupCategory" DROP CONSTRAINT "GroupCategory_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_groupId_fkey";

-- DropIndex
DROP INDEX "Question_categoryId_idx";

-- DropIndex
DROP INDEX "Question_groupId_position_id_idx";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "categoryId",
DROP COLUMN "groupId",
ADD COLUMN     "topicId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "GroupCategory";

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Topic_groupId_idx" ON "Topic"("groupId");

-- CreateIndex
CREATE INDEX "Question_topicId_position_id_idx" ON "Question"("topicId", "position", "id");

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "QuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Topic" ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX "Topic_one_default_per_group" ON "Topic" ("groupId") WHERE "isDefault" = true;
COMMIT;