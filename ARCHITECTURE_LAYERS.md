# Spring Boot Layer Purposes

This project follows a standard layered backend structure:

Client Request -> Controller -> Service -> Repo -> Entity -> MongoDB -> Response

## Controller Layer

- Folder: `demo/src/main/java/com/smartcampus/demo/Controller`
- Responsibility: Exposes HTTP APIs.
- Handles: Request mapping, input from path/body/query, and response status/body.
- Delegates work to: Service layer.

In short: how clients talk to the backend.

## Service Layer

- Folder: `demo/src/main/java/com/smartcampus/demo/Service`
- Responsibility: Business logic.
- Handles: Validation, business rules, combining multiple repo calls, side effects.
- Delegates persistence to: Repo layer.

In short: what should happen according to business rules.

## Repo Layer

- Folder: `demo/src/main/java/com/smartcampus/demo/Repo`
- Responsibility: Data access.
- Usually extends: `MongoRepository<YourEntity, String>`.
- Handles: CRUD and query methods such as `findBy...`, `deleteBy...`, `countBy...`.

In short: how data is read and written.

## Entity Layer

- Folder: `demo/src/main/java/com/smartcampus/demo/Entity`
- Responsibility: Database document model.
- Defines: Fields, types, and mapping annotations (for example `@Document`, `@Id`).
- Represents: MongoDB collections/documents.

In short: what data exists.

## Why This Separation Helps

- Cleaner code with single responsibility per layer.
- Easier testing (API, business logic, and data access can be tested separately).
- Easier maintenance (changes stay localized to the relevant layer).

## Request Flow Example

1. Controller receives `POST /api/v1/comments/save`.
2. Controller calls `CommentService`.
3. Service validates data and applies business rules.
4. Service calls `CommentRepo`.
5. Repo stores/fetches `Comment` entity in MongoDB.
6. Result is returned back through service/controller as JSON.
