# Server API

Stage 2 implements database operations. The browser store remains on localStorage until stage 3.
No authentication or per-user ownership: all application visitors use the same data.

## Routes

| Method | Path                                       | Body / response                              |
| ------ | ------------------------------------------ | -------------------------------------------- |
| GET    | /api/groups                                | All groups with nested topics and questions  |
| POST   | /api/groups                                | { name, accentColor }                        |
| GET    | /api/groups/:groupId                       | One group with nested topics and questions   |
| PUT    | /api/groups/:groupId                       | { name, accentColor }                        |
| DELETE | /api/groups/:groupId                       | Delete group, topics and questions           |
| POST   | /api/groups/:groupId/topics                | { name }                                     |
| PUT    | /api/groups/:groupId/topics/:topicId       | { name }                                     |
| DELETE | /api/groups/:groupId/topics/:topicId       | Move questions to default, then delete topic |
| POST   | /api/groups/:groupId/questions             | { question, answer, topicId? }               |
| PUT    | /api/groups/:groupId/questions/:questionId | { question, answer, topicId? }               |
| DELETE | /api/groups/:groupId/questions/:questionId | Delete question                              |

POST/PUT require Content-Type: application/json. PUT replaces editable fields.
A missing or null topicId chooses the group's system topic.
Read topics/questions from the nested group response.
Responses: { data: ... }; POST returns 201, DELETE returns 204 without a body.
Errors: { error: string }, with 400 invalid input/JSON, 404 missing or wrong-group record,
409 protected system topic or conflict, 415 wrong content type, 500 database failure.
Responses are not cached. Driver details and credentials are never returned.

## Rules

- The server generates IDs; group creation atomically creates its own default topic.
- Topic.isDefault is internal. The system topic cannot be renamed or deleted via API.
- Names, questions and answers must contain non-whitespace text; colors use #RRGGBB.
- Unexpected fields are rejected. Clients cannot set group ownership, isDefault or position.
- Questions can move between topics only within the same group.
- Positions are assigned on the server. New/moved questions are appended; editing in place preserves order.
- Topic deletion appends its questions to the default topic in their existing order.
- Group deletion cascades only within that group.
- Group mutations lock the group row in a transaction so competing creates, moves and deletes
  cannot lose questions or assign the same next position. This protects writes through this service;
  manual database writes must preserve the same rules.
- Reads use name/id for groups and topics, system topic first, then position/id for questions.

## Verification

npm run test:integration runs the actual route handlers against the database configured in .env.local.
It verifies CRUD, validation, group isolation, protected topics, concurrent positions and deletion.
It creates uniquely identified test groups and removes only those groups in finally.
npm test covers the existing browser behavior; npm run build validates the Next.js routes.

Source: src/server/library.ts (operations), validation.ts (inputs), http.ts (responses).
