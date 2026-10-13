# Server API

Responses have the form { data: ... }; errors have the form { error: string }.
All mutable requests require Content-Type: application/json. Responses are not cached.

## Categories

| Method           | Path                                                        | Body                                       |
| ---------------- | ----------------------------------------------------------- | ------------------------------------------ |
| GET, POST        | /api/categories                                             | name and accentColor for POST              |
| GET, PUT, DELETE | /api/categories/:categoryId                                 | name and accentColor for PUT               |
| GET              | /api/categories/:categoryId/deletion-impact                 | —                                          |
| POST             | /api/categories/:categoryId/topics                          | name and accentColor                       |
| GET              | /api/categories/:categoryId/topics/:topicId/deletion-impact | —                                          |
| PUT, DELETE      | /api/categories/:categoryId/topics/:topicId                 | name and accentColor for PUT               |
| POST             | /api/categories/:categoryId/questions                       | question, answer, optional topicId         |
| PUT, DELETE      | /api/categories/:categoryId/questions/:questionId           | question, answer, optional topicId for PUT |

Category list items include the numbers of topics and questions. The deletion-impact endpoint
returns the number of trainings that reference the category, its topics, or its questions, together
with their ids, names and statuses.
Category reads return flat category, topics, questions, categoryQuestions and topicQuestions DTOs.
A question always belongs to one category and may belong to one topic in that category.
Deleting a topic only removes that topic's links and retains its questions in the category. Its
deletion-impact endpoint returns trainings that reference the topic or its questions. Deleting a
category removes its questions and every related link.

## Trainings

| Method           | Path                                             | Body                    |
| ---------------- | ------------------------------------------------ | ----------------------- |
| GET, POST        | /api/trainings                                   | Training input for POST |
| GET, PUT, DELETE | /api/trainings/:trainingId                       | Training input for PUT  |
| POST             | /api/trainings/:trainingId/start                 | —                       |
| POST             | /api/trainings/:trainingId/restart               | —                       |
| POST             | /api/trainings/:trainingId/regenerate            | —                       |
| PUT              | /api/trainings/:trainingId/questions/:questionId | status ACCEPTED         |

Training input contains name, order, optional questionLimit (time per question in seconds), categoryIds, topicIds and
questionIds. Selecting a category or topic includes all of its questions; questionIds adds
individual questions. The server removes duplicates, validates every referenced record, and
stores the resulting set and its order. Order is SEQUENTIAL or RANDOM; regeneration only
shuffles the already saved set. A completed training is restarted before it can be started again.
