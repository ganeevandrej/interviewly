-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'READY');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "color" TEXT,
    "description" TEXT,
    "team" JSONB,
    "tasks" JSONB,
    "responsibilities" JSONB,
    "achievements" JSONB,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technology" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Technology_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTechnology" (
    "projectId" TEXT NOT NULL,
    "technologyId" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectTechnology_pkey" PRIMARY KEY ("projectId", "technologyId")
);

-- CreateTable
CREATE TABLE "ProjectQuestion" (
    "projectId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "ProjectQuestion_pkey" PRIMARY KEY ("projectId", "questionId")
);

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN "projectId" TEXT;
ALTER TABLE "Tag" ADD COLUMN "topicId" TEXT;
ALTER TABLE "Tag" ADD COLUMN "groupId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Technology_name_key" ON "Technology"("name");
CREATE UNIQUE INDEX "Tag_projectId_key" ON "Tag"("projectId");
CREATE UNIQUE INDEX "Tag_topicId_key" ON "Tag"("topicId");
CREATE UNIQUE INDEX "Tag_groupId_key" ON "Tag"("groupId");
CREATE INDEX "ProjectTechnology_technologyId_idx" ON "ProjectTechnology"("technologyId");
CREATE UNIQUE INDEX "ProjectQuestion_questionId_key" ON "ProjectQuestion"("questionId");
CREATE INDEX "ProjectQuestion_questionId_idx" ON "ProjectQuestion"("questionId");

-- AddForeignKey
ALTER TABLE "ProjectTechnology" ADD CONSTRAINT "ProjectTechnology_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectTechnology" ADD CONSTRAINT "ProjectTechnology_technologyId_fkey" FOREIGN KEY ("technologyId") REFERENCES "Technology"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectQuestion" ADD CONSTRAINT "ProjectQuestion_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectQuestion" ADD CONSTRAINT "ProjectQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "QuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Only the server database connection accesses application tables.
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Technology" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProjectTechnology" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ProjectQuestion" ENABLE ROW LEVEL SECURITY;
