-- CreateTable
CREATE TABLE "ProjectTag" (
    "projectId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "isAutoCreated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectTag_pkey" PRIMARY KEY ("projectId", "tagId")
);

-- CreateTable
CREATE TABLE "TopicTag" (
    "topicId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "isAutoCreated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TopicTag_pkey" PRIMARY KEY ("topicId", "tagId")
);

-- Migrate existing automatic owner links before removing the owner columns.
INSERT INTO "ProjectTag" ("projectId", "tagId", "isAutoCreated")
SELECT "projectId", "id", true
FROM "Tag"
WHERE "projectId" IS NOT NULL;

INSERT INTO "TopicTag" ("topicId", "tagId", "isAutoCreated")
SELECT "topicId", "id", true
FROM "Tag"
WHERE "topicId" IS NOT NULL;

-- CreateIndex
CREATE INDEX "ProjectTag_tagId_idx" ON "ProjectTag"("tagId");
CREATE INDEX "TopicTag_tagId_idx" ON "TopicTag"("tagId");

-- AddForeignKey
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TopicTag" ADD CONSTRAINT "TopicTag_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TopicTag" ADD CONSTRAINT "TopicTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Remove the old owner columns and the unused QuestionGroup owner relation.
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_projectId_fkey";
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_topicId_fkey";
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_groupId_fkey";
DROP INDEX "Tag_projectId_key";
DROP INDEX "Tag_topicId_key";
DROP INDEX "Tag_groupId_key";
ALTER TABLE "Tag" DROP COLUMN "projectId";
ALTER TABLE "Tag" DROP COLUMN "topicId";
ALTER TABLE "Tag" DROP COLUMN "groupId";

-- Only the server database connection accesses application tables.
ALTER TABLE "ProjectTag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TopicTag" ENABLE ROW LEVEL SECURITY;
