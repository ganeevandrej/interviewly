---
name: interview-task-workflow
description: Prepare and execute Interviewly feature or bug tasks with branch safety, clarification-first requirements, codebase analysis, AGENTS.md compliance, and relevant skill selection.
metadata:
  short-description: Safely execute Interviewly tasks
---

# Interviewly task workflow

Use this skill when the user asks to read one or more tasks and implement them in the Interviewly repository, for example: “прочитай задачу «...» и выполни её используя skill ...”.

## Core rules

- Do not invent requirements, API contracts, file locations, acceptance criteria, or behavior.
- If a requirement, task dependency, expected behavior, or scope is unclear, ask a concise clarifying question before changing code.
- Read the repository `AGENTS.md` before implementation and follow its rules.
- Use only skills relevant to the current task. Inspect available skill descriptions and load the selected skills before taking the related action.
- Do not expand the task based on the broader project context. Mention useful follow-up work instead of implementing it unless the user explicitly included it.

## Branch safety — perform first

Before reading external tasks or editing code:

1. Run `git status --short --branch` and identify the current branch.
2. If the current branch is `master`, create a new branch named for the feature or bug before continuing, such as `feature/<short-name>` or `fix/<short-name>`.
3. If the current branch is not `master`, check whether it is already merged into `master` using the repository’s local git information.
4. If the current branch is not merged into `master`, stop. Tell the user which branch is active and that work will not be performed until it is merged into `master`.
5. Do not reset, rebase, delete, or rewrite the user’s branch without explicit instruction.

Preserve unrelated working-tree changes and ask before a requested change would overlap them dangerously.

## Requirements and task reading

Read the exact task named by the user using the requested task-tracking integration or the project’s documented source. If it references context, prerequisites, or related tasks, read them only when needed to resolve scope or acceptance criteria.

Summarize internally the requested outcome, in-scope changes, out-of-scope items, dependencies, acceptance criteria, and unresolved questions. Ask the user about every unresolved item that can materially change the implementation. Do not start implementation while such an item remains unanswered.

Before any external tool or MCP call, briefly state what information is needed, why it is needed, and what risk comes from skipping it. Follow repository instructions for confirmation and authorization.

## Repository and architecture analysis

After the task is unambiguous and the branch is safe:

1. Read only relevant project documentation in `docs/`.
2. Inspect the complete client-side area involved, its direct consumers, related server/API contracts, types, configuration, and tests.
3. Search references before changing or removing a file.
4. Identify existing patterns and constraints instead of assuming patterns from another project.
5. State the implementation scope and verification plan before substantial edits.

## Implementation

- Follow `AGENTS.md`, including code style, file-editing, and verification rules.
- Keep changes simple and readable. Avoid speculative abstractions and unrelated refactors.
- Preserve existing user changes. Do not delete old code unless the task explicitly requires it and all consumers have been migrated.
- Use relevant specialized skills for the technologies or workflow involved, but do not load skills merely because a technology exists in the stack.
- If a tool, plugin, or external permission is required, request it at the point of use and do not silently substitute an unverified assumption.

## Verification and handoff

Run the minimum relevant local checks required by `AGENTS.md` and the task, normally type-check, lint, and focused tests. Do not start a dev server, browser, or visual test unless explicitly requested or required by the task.

Before reporting completion, verify the current branch and working tree, changed files and task scope, checks and their results, and any remaining limitation or follow-up. Do not create a commit unless the user explicitly asks for one.
