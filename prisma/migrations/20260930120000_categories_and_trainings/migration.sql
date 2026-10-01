-- Preserve each question's category and ordinary topic before removing the old hierarchy.
CREATE TABLE "CategoryQuestion" (
    "categoryId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "CategoryQuestion_pkey" PRIMARY KEY ("categoryId", "questionId")
);

CREATE TABLE "TopicQuestion" (
    "topicId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "TopicQuestion_pkey" PRIMARY KEY ("topicId", "questionId"),
    CONSTRAINT "TopicQuestion_questionId_key" UNIQUE ("questionId")
);

INSERT INTO "CategoryQuestion" ("categoryId", "questionId", "position")
SELECT t."groupId", q."id", q."position"
FROM "Question" q
JOIN "Topic" t ON t."id" = q."topicId";

INSERT INTO "TopicQuestion" ("topicId", "questionId", "position")
SELECT q."topicId", q."id", q."position"
FROM "Question" q
JOIN "Topic" t ON t."id" = q."topicId"
WHERE t."isDefault" = false;

-- System topics are no longer part of the model. Their questions remain linked to categories.
DELETE FROM "Topic" WHERE "isDefault" = true;

-- A question may be linked to only one story after this migration.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "StoryQuestion"
        GROUP BY "questionId"
        HAVING count(*) > 1
    ) THEN
        RAISE EXCEPTION 'Cannot add the StoryQuestion.questionId unique constraint: one or more questions belong to multiple stories.';
    END IF;
END $$;

ALTER TABLE "Question" DROP CONSTRAINT "Question_topicId_fkey";
DROP INDEX "Question_topicId_position_id_idx";
ALTER TABLE "Question" DROP COLUMN "topicId", DROP COLUMN "position";

ALTER TABLE "Topic" DROP CONSTRAINT "Topic_groupId_fkey";
DROP INDEX "Topic_groupId_idx";
DROP INDEX "Topic_one_default_per_group";
ALTER TABLE "Topic" DROP COLUMN "isDefault";
ALTER TABLE "Topic" RENAME COLUMN "groupId" TO "categoryId";
ALTER TABLE "QuestionGroup" RENAME TO "Category";

ALTER TABLE "Topic" ADD CONSTRAINT "Topic_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "Topic_categoryId_idx" ON "Topic"("categoryId");

ALTER TABLE "CategoryQuestion" ADD CONSTRAINT "CategoryQuestion_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CategoryQuestion" ADD CONSTRAINT "CategoryQuestion_questionId_fkey"
    FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE UNIQUE INDEX "CategoryQuestion_questionId_key" ON "CategoryQuestion"("questionId");
CREATE INDEX "CategoryQuestion_categoryId_position_questionId_idx"
    ON "CategoryQuestion"("categoryId", "position", "questionId");

ALTER TABLE "TopicQuestion" ADD CONSTRAINT "TopicQuestion_topicId_fkey"
    FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TopicQuestion" ADD CONSTRAINT "TopicQuestion_questionId_fkey"
    FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "TopicQuestion_topicId_position_questionId_idx"
    ON "TopicQuestion"("topicId", "position", "questionId");

ALTER TABLE "StoryQuestion" ADD CONSTRAINT "StoryQuestion_questionId_key" UNIQUE ("questionId");

CREATE TYPE "TrainingStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');
CREATE TYPE "TrainingOrder" AS ENUM ('SEQUENTIAL', 'RANDOM');
CREATE TYPE "TrainingQuestionStatus" AS ENUM ('IN_PROGRESS', 'ACCEPTED');

CREATE TABLE "Training" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "TrainingStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "order" "TrainingOrder" NOT NULL,
    "questionLimit" INTEGER,

    CONSTRAINT "Training_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TrainingCategory" (
    "trainingId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "TrainingCategory_pkey" PRIMARY KEY ("trainingId", "categoryId")
);

CREATE TABLE "TrainingTopic" (
    "trainingId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "TrainingTopic_pkey" PRIMARY KEY ("trainingId", "topicId")
);

CREATE TABLE "TrainingQuestion" (
    "trainingId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "status" "TrainingQuestionStatus" NOT NULL DEFAULT 'IN_PROGRESS',

    CONSTRAINT "TrainingQuestion_pkey" PRIMARY KEY ("trainingId", "questionId")
);

CREATE INDEX "TrainingCategory_categoryId_idx" ON "TrainingCategory"("categoryId");
CREATE INDEX "TrainingTopic_topicId_idx" ON "TrainingTopic"("topicId");
CREATE INDEX "TrainingQuestion_trainingId_position_questionId_idx"
    ON "TrainingQuestion"("trainingId", "position", "questionId");
CREATE INDEX "TrainingQuestion_questionId_idx" ON "TrainingQuestion"("questionId");

ALTER TABLE "TrainingCategory" ADD CONSTRAINT "TrainingCategory_trainingId_fkey"
    FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainingCategory" ADD CONSTRAINT "TrainingCategory_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainingTopic" ADD CONSTRAINT "TrainingTopic_trainingId_fkey"
    FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainingTopic" ADD CONSTRAINT "TrainingTopic_topicId_fkey"
    FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainingQuestion" ADD CONSTRAINT "TrainingQuestion_trainingId_fkey"
    FOREIGN KEY ("trainingId") REFERENCES "Training"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TrainingQuestion" ADD CONSTRAINT "TrainingQuestion_questionId_fkey"
    FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CategoryQuestion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TopicQuestion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Training" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TrainingCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TrainingTopic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TrainingQuestion" ENABLE ROW LEVEL SECURITY;
