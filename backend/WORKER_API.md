# Field Worker API Documentation

This document describes the exact REST API endpoints currently implemented in the backend for the `FIELD_WORKER` role.

---

## Table of Contents
1. [Authentication](#1-authentication)
2. [Worker Profile & Stats](#2-worker-profile--stats)
3. [Assigned Tasks](#3-assigned-tasks)
4. [Task Details](#4-task-details)
5. [Workflow Transitions](#5-workflow-transitions)
    * [Accept Task](#accept-task)
    * [Start Task](#start-task)
    * [Upload Proof & Complete Task](#upload-proof--complete-task)
    * [Complete Task (Without Proof)](#complete-task-without-proof)
6. [Notifications](#6-notifications)

---

## 1. Authentication

All worker and notification endpoints require Firebase Authentication.

*   **Authentication:** Firebase ID Token
*   **Required Role:** `FIELD_WORKER`
*   **Request Headers:**
    *   `Authorization: Bearer <Firebase_ID_Token>`

*The backend resolves the worker's identity directly from the decoded Firebase JWT (`req.user._id`), preventing ID spoofing. Raw worker IDs are never accepted in the request body for scoping data.*

---

## 2. Worker Profile & Stats

### Get Worker Profile

*   **Endpoint:** `/api/workers/me`
*   **HTTP Method:** `GET`
*   **Authentication:** Firebase ID Token
*   **Required Role:** `FIELD_WORKER`
*   **URL Parameters:** None
*   **Query Parameters:** None
*   **Request Headers:** `Authorization: Bearer <token>`
*   **Request Body:** None
*   **Frontend Consumer:** `WorkerProfile.jsx`, `WorkerDashboard.jsx`

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Worker profile fetched",
  "data": {
    "user": {
      "id": "60d5ecb8b392...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+91 9876543210",
      "photoURL": "https://...",
      "role": "FIELD_WORKER",
      "department": "60d5ec...",
      "ward": "Ward 15",
      "isActive": true,
      "createdAt": "2023-10-01T12:00:00.000Z"
    },
    "stats": {
      "total": 45,
      "assigned": 5,
      "accepted": 2,
      "inProgress": 1,
      "pendingVerification": 4,
      "resolved": 33,
      "overdue": 1
    }
  }
}
```

#### Error Responses
*   **401 Unauthorized:** Invalid or missing Firebase token.
*   **403 Forbidden:** User is not a `FIELD_WORKER`.

---

## 3. Assigned Tasks

### List Worker Tasks (and Map Data)

*   **Endpoint:** `/api/workers/me/tasks`
*   **HTTP Method:** `GET`
*   **Authentication:** Firebase ID Token
*   **Required Role:** `FIELD_WORKER`
*   **URL Parameters:** None
*   **Query Parameters:**
    *   `status` (optional): Filter by issue status (e.g., `ASSIGNED`, `IN_PROGRESS`).
    *   `page` (optional): Default `1`.
    *   `limit` (optional): Default `20`, max `50` (or `100` for map).
*   **Request Headers:** `Authorization: Bearer <token>`
*   **Request Body:** None
*   **Frontend Consumer:** `AssignedTasks.jsx`, `WorkerDashboard.jsx`, `WorkerMap.jsx`

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": {
    "tasks": [
      {
        "_id": "60d5ecc...",
        "issueId": "ISS-0042",
        "title": "Large pothole on main street",
        "status": "ASSIGNED",
        "category": "POTHOLE",
        "priority": "HIGH",
        "location": {
          "type": "Point",
          "coordinates": [72.8710, 19.1145]
        },
        "address": "Main St, Mumbai",
        "createdAt": "2023-10-05T09:00:00.000Z",
        "dueDate": "2023-10-07T09:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}
```

---

## 4. Task Details

### Get Single Task Details

*   **Endpoint:** `/api/workers/me/tasks/:id`
*   **HTTP Method:** `GET`
*   **Authentication:** Firebase ID Token
*   **Required Role:** `FIELD_WORKER`
*   **URL Parameters:**
    *   `id` (required): The MongoDB `_id` of the Issue.
*   **Query Parameters:** None
*   **Request Headers:** `Authorization: Bearer <token>`
*   **Request Body:** None
*   **Frontend Consumer:** `TaskDetails.jsx`, `UploadProof.jsx`

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Task fetched successfully",
  "data": {
    "task": {
      "_id": "60d5ecc...",
      "issueId": "ISS-0042",
      "title": "Large pothole",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "category": "POTHOLE",
      "description": "Deep pothole causing accidents",
      "address": "Main St, Mumbai",
      "location": { "type": "Point", "coordinates": [72.871, 19.114] },
      "images": ["https://res.cloudinary.com/..."],
      "beforeImages": [],
      "afterImages": []
    },
    "timeline": [
      {
        "_id": "60d5ecd...",
        "action": "WORKER_ASSIGNED",
        "oldStatus": "VERIFIED",
        "newStatus": "ASSIGNED",
        "performedBy": { "name": "Admin" },
        "createdAt": "2023-10-05T10:00:00.000Z"
      }
    ]
  }
}
```

#### Error Responses
*   **404 Not Found:** Task does not exist or is not assigned to the requesting worker.

---

## 5. Workflow Transitions

### Accept Task

*   **Endpoint:** `/api/workers/tasks/:id/accept`
*   **HTTP Method:** `PATCH`
*   **Authentication:** Firebase ID Token
*   **Required Role:** `FIELD_WORKER`
*   **Status Transition:** `ASSIGNED` → `ACCEPTED`
*   **URL Parameters:** `id` (Issue MongoDB `_id`)
*   **Request Body:**
    *   `note` (optional string): Note to add to the timeline.
*   **Frontend Consumer:** `TaskDetails.jsx`

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Task accepted successfully",
  "data": {
    "task": { "_id": "...", "status": "ACCEPTED" }
  }
}
```

#### Error Responses
*   **404 Not Found:** Task not found or not assigned to you.
*   **422 Unprocessable Entity:** Task is not in `ASSIGNED` state.

---

### Start Task

*   **Endpoint:** `/api/workers/tasks/:id/start`
*   **HTTP Method:** `PATCH`
*   **Authentication:** Firebase ID Token
*   **Required Role:** `FIELD_WORKER`
*   **Status Transition:** `ACCEPTED` → `IN_PROGRESS`
*   **URL Parameters:** `id` (Issue MongoDB `_id`)
*   **Request Body:**
    *   `note` (optional string): Note to add to the timeline.
*   **Frontend Consumer:** `TaskDetails.jsx`

---

### Upload Proof & Complete Task

*   **Endpoint:** `/api/workers/tasks/:id/proof`
*   **HTTP Method:** `POST`
*   **Authentication:** Firebase ID Token
*   **Required Role:** `FIELD_WORKER`
*   **Status Transition:** `IN_PROGRESS` → `PENDING_CITIZEN_VERIFICATION`
*   **URL Parameters:** `id` (Issue MongoDB `_id`)
*   **Request Headers:** `Content-Type: multipart/form-data` (Automatically set by browser)
*   **Multipart/form-data fields:**
    *   `afterImages` (required, file, max 5): Photos taken after repair.
    *   `beforeImages` (optional, file, max 5): Photos taken before repair (if missing initially).
    *   `repairNote` (optional text, max 1000 chars): Details about the repair.
*   **Frontend Consumer:** `UploadProof.jsx`

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Proof submitted successfully. Awaiting citizen verification.",
  "data": {
    "task": { "_id": "...", "status": "PENDING_CITIZEN_VERIFICATION", "afterImages": ["https://..."] }
  }
}
```

#### Error Responses
*   **400 Bad Request:** File too large (>5MB), invalid format, missing images, or `repairNote` exceeds 1000 chars.
*   **422 Unprocessable Entity:** Task is not in `IN_PROGRESS` state.

---

### Complete Task (Without Proof)

*   **Endpoint:** `/api/workers/tasks/:id/complete`
*   **HTTP Method:** `PATCH`
*   **Authentication:** Firebase ID Token
*   **Required Role:** `FIELD_WORKER`
*   **Status Transition:** `IN_PROGRESS` → `PENDING_CITIZEN_VERIFICATION`
*   **URL Parameters:** `id` (Issue MongoDB `_id`)
*   **Request Body:**
    *   `note` (optional string): Note to add to the timeline.
*   **Frontend Consumer:** None actively used (frontend prefers `/proof`).

---

## 6. Notifications

*Note: Notification endpoints are global and available to all authenticated roles. Data is strictly scoped to `req.user._id`.*

### Get Notifications

*   **Endpoint:** `/api/notifications`
*   **HTTP Method:** `GET`
*   **Authentication:** Firebase ID Token
*   **Query Parameters:**
    *   `isRead` (optional string): `"true"` or `"false"`.
    *   `limit` (optional): Default 20.
*   **Frontend Consumer:** `WorkerNotifications.jsx`

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "60d5...",
        "title": "New Task Assigned",
        "message": "You have been assigned to ISS-0042",
        "type": "TASK_ASSIGNED",
        "isRead": false,
        "createdAt": "2023-10-05T09:00:00.000Z",
        "issue": {
          "_id": "...",
          "issueId": "ISS-0042"
        }
      }
    ],
    "unreadCount": 1
  }
}
```

### Mark Notification as Read

*   **Endpoint:** `/api/notifications/:id/read`
*   **HTTP Method:** `PATCH`
*   **URL Parameters:** `id` (Notification MongoDB `_id`)
*   **Frontend Consumer:** `WorkerNotifications.jsx`

### Mark All Notifications as Read

*   **Endpoint:** `/api/notifications/read-all`
*   **HTTP Method:** `PATCH`
*   **Frontend Consumer:** `WorkerNotifications.jsx`
