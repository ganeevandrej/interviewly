-- Add the mandatory topic color and initialize every existing topic.
ALTER TABLE "Topic" ADD COLUMN "accentColor" TEXT NOT NULL DEFAULT '#70DECF';

-- New topics must provide their color through the application contract.
ALTER TABLE "Topic" ALTER COLUMN "accentColor" DROP DEFAULT;
