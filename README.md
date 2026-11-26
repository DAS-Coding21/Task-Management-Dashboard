# Task Management Dashboard

TaskFlow is a task management web application. Users can register, sign in, create tasks, and view each task's status. The frontend is built with HTML, CSS, and JavaScript. An Express server provides the API, and SQLite stores users and tasks.

## Project Structure

- `index.html` - Landing page with registration and sign-in forms.
- `JS/script.js` - Handles registration and sign-in requests.
- `dashboard-section/dashboard.html` - Dashboard page structure.
- `dashboard-section/dashboard.js` - Loads tasks, displays task counts, and handles task status changes.
- `dashboard-section/style.css` - Dashboard layout and task styling.
- `server.js` - Express server and API routes.
- `taskFlow.db` - SQLite database.

## Sign-In and Dashboard User

When sign-in succeeds, `JS/script.js` stores the user's ID and username in browser `localStorage` under the key `userLoginData`. The value is a JSON array containing an object with `userId` and `userName`.

When the dashboard loads, `dashboard.js` reads this value, displays the username, and uses the user ID to request that user's tasks.

## Dashboard Task Flow

### Loading Tasks

The dashboard requests the signed-in user's tasks from:

```text
GET http://localhost:3000/tasks/{userId}/
```

The server returns the tasks from SQLite. The dashboard creates a task card for each task and updates the total, pending, and completed counts.

### Creating a Task

When the user selects **Add**, the dashboard reads the title from `taskInput` and sends the title and user ID as JSON:

```text
POST http://localhost:3000/tasks/
```

The server inserts the task with the initial status `pending`. The current frontend logs the response but does not refresh the displayed task list automatically; a reload fetches the new task.

### Completing or Reopening a Task

Each task card has a checkbox and a label. Changing the checkbox sends the corresponding status to the server:

```text
PUT http://localhost:3000/tasks/{taskId}
```

The status values used by the app are:

- `pending` - The task is not complete.
- `completed` - The task is complete.

The server saves the status in SQLite. When tasks are loaded again, the dashboard checks whether each task has status `completed`. If so, it checks the checkbox and adds the `label-status` class to the task label. In `dashboard-section/style.css`, that class applies `text-decoration: line-through`. This is why the saved task status—not the checkbox's temporary browser state—allows the strikethrough to appear after a reload.

### Deleting a Task

Selecting a task's trash button sends a `DELETE` request to the backend:

```text
DELETE http://localhost:3000/tasks/{taskId}
```

The server deletes the matching task from SQLite and returns a JSON response. If the request succeeds, the dashboard fetches the signed-in user's tasks again. This refreshes the task cards and the total, pending, and completed counts. If the server responds with invalid JSON or an unsuccessful status, the dashboard logs the error in the browser console.

### Task Counts

The dashboard calculates counts from the tasks returned by the server:

- **Total** is the number of tasks.
- **Pending** counts tasks with status `pending`.
- **Complete** counts tasks with status `completed`.

The dashboard HTML currently uses the ID `pendignTasks` for the pending-count element. It is misspelled, but the JavaScript uses the same ID, so both files currently match.

## API Endpoints

| Purpose | Method | Endpoint |
| --- | --- | --- |
| Register a user | `POST` | `/users/register/` |
| Sign in | `POST` | `/users/login/` |
| Create a task | `POST` | `/tasks/` |
| Get a user's tasks | `GET` | `/tasks/{userId}/` |
| Update a task's status | `PUT` | `/tasks/{taskId}` |
| Delete a task | `DELETE` | `/tasks/{taskId}` |

The task API is served by the Express backend, which runs locally at `http://localhost:3000`.

## Current Limitations

- After a task is created, the list is not refreshed automatically.
- If a status update request fails, `updateTaskStatus()` logs the error, but the checkbox and strikethrough have already changed in the page. Reloading will show the status saved by the server.
- Dashboard initialization expects `userLoginData` to contain a valid JSON array with a user object. Missing or invalid data can cause an error before the redirect check runs.
