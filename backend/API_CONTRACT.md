# CivicConnect Backend — API Contract

> **Base URL:** `http://localhost:5000/api` (development)
> **Content-Type:** `application/json` unless stated otherwise
> **Rate limits:** 200 req / 15 min per IP globally · 15 req / 15 min on `/auth/session`

---

## Standard Response Envelope

Every endpoint returns this shape:

```json
{ "success": true | false, "message": "...", "data": { ... } }
```

Validation failures return **422** with an `errors` array:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "latitude", "message": "latitude must be between -90 and 90" }
  ]
}
```

---

## Role Reference

| Role | Description |
|---|---|
| `CITIZEN` | End user who reports issues |
| `SUPER_ADMIN` | Platform-wide administrator |
| `DEPARTMENT_ADMIN` | Manages a single department |
| `WARD_OFFICER` | Verifies issues in a geographic ward |
| `FIELD_WORKER` | On-site repair worker |

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/session`

Verifies a Firebase ID token and upserts the CivicConnect user profile.
Called by the frontend immediately after every Firebase login.

| Property | Value |
|---|---|
| Auth | **None** — token is read from the `Authorization` header inside the controller |
| Rate limit | 15 req / 15 min per IP |

**Request headers:**
```
Authorization: Bearer <Firebase ID Token>
```

**Success `200`:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "user": {
      "_id": "...",
      "firebaseUid": "...",
      "name": "Priya Sharma",
      "email": "priya@example.com",
      "role": "CITIZEN",
      "isActive": true,
      "createdAt": "2026-08-01T10:00:00.000Z"
    }
  }
}
```

**Errors:**

| Status | Condition |
|---|---|
| `401` | Missing or invalid Firebase token |
| `401` | Expired Firebase token |
| `403` | User account is deactivated (`isActive: false`) |
| `500` | Database error |

---

### `GET /api/auth/me`

Returns the currently authenticated user's full profile.

| Property | Value |
|---|---|
| Auth | Required — Firebase ID Token |
| Roles | All authenticated roles |

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Priya Sharma",
      "email": "priya@example.com",
      "role": "CITIZEN",
      "isActive": true
    }
  }
}
```

**Errors:**

| Status | Condition |
|---|---|
| `401` | Missing / invalid / expired token |
| `403` | Inactive account |

---

## 2. Health Check

### `GET /api/health`

| Property | Value |
|---|---|
| Auth | None |
| Rate limit | Exempt |

**Success `200`:**
```json
{ "success": true, "message": "CivicConnect backend is running" }
```

---

## 3. Issues (`/api/issues`)

### `GET /api/issues/nearby` _(public)_

Returns active issues within a radius for the public Leaflet map.
**No authentication required.** Returns a stripped public projection — no PII.

| Property | Value |
|---|---|
| Auth | **None (public)** |
| Roles | Public |

**Query parameters:**

| Param | Type | Required | Description |
|---|---|---|---|
| `lat` | number | YES | Latitude (-90 to 90) |
| `lng` | number | YES | Longitude (-180 to 180) |
| `radius` | number | YES | Search radius in metres (1–50 000) |

**Example:**
```
GET /api/issues/nearby?lat=28.6139&lng=77.2090&radius=2000
```

**Success `200`:**
```json
{
  "success": true,
  "message": "Nearby issues fetched",
  "data": {
    "count": 3,
    "issues": [
      {
        "_id": "...",
        "title": "Large pothole near flyover",
        "category": "POTHOLE",
        "priority": "HIGH",
        "status": "ASSIGNED",
        "location": { "type": "Point", "coordinates": [77.2095, 28.6142] },
        "address": "Ring Road, Lajpat Nagar",
        "ward": "Ward 15",
        "images": ["https://res.cloudinary.com/..."],
        "createdAt": "2026-08-10T08:30:00.000Z"
      }
    ]
  }
}
```

> **Leaflet marker mapping:**
> `coordinates` is `[longitude, latitude]` (GeoJSON order).
> ```js
> const [lng, lat] = issue.location.coordinates;
> L.marker([lat, lng]).bindPopup(issue.title).addTo(map);
> ```

**Errors:**

| Status | Condition |
|---|---|
| `422` | Invalid or out-of-range `lat`, `lng`, or `radius` |

---

### `POST /api/issues`

Reports a new civic issue.

| Property | Value |
|---|---|
| Auth | Required |
| Roles | All authenticated roles |

**Request body:**
```json
{
  "title": "Large pothole near flyover",
  "description": "Deep pothole causing vehicle damage. Approximately 2 ft wide.",
  "category": "POTHOLE",
  "priority": "HIGH",
  "location": {
    "type": "Point",
    "coordinates": [77.2090, 28.6139]
  },
  "address": "Ring Road, near Lajpat Nagar flyover",
  "ward": "Ward 15"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `title` | string | YES | Max 200 chars |
| `description` | string | YES | Max 2000 chars |
| `category` | enum | YES | `POTHOLE \| GARBAGE \| STREETLIGHT \| DRAINAGE \| ROAD_DAMAGE \| WATER_LEAK \| OTHER` |
| `location` | GeoJSON Point | YES | `coordinates[0]`=lng, `coordinates[1]`=lat |
| `priority` | enum | NO | `LOW \| MEDIUM \| HIGH \| CRITICAL` (default `MEDIUM`) |
| `address` | string | NO | Max 500 chars |
| `ward` | string | NO | Max 100 chars |

> `reportedBy` is always taken from `req.user._id` — never from the body.

**Success `201`:**
```json
{
  "success": true,
  "message": "Issue reported successfully",
  "data": { "issue": { "_id": "...", "status": "REPORTED", ... } }
}
```

**Errors:**

| Status | Condition |
|---|---|
| `401` | Not authenticated |
| `422` | Validation failure (returns `errors` array) |

---

### `GET /api/issues`

Lists issues with pagination and role-scoped filtering.

| Property | Value |
|---|---|
| Auth | Required |
| Roles | All authenticated roles |

**Query parameters:**

| Param | Type | Description |
|---|---|---|
| `status` | enum | Filter by issue status |
| `category` | enum | Filter by category |
| `priority` | enum | Filter by priority |
| `ward` | string | Filter by ward name |
| `search` | string | Text search on title/description |
| `page` | number | Page number (default: 1) |
| `limit` | number | Per page (default: 20, max: 50) |

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "issues": [ { ... } ],
    "pagination": { "total": 142, "page": 1, "limit": 20, "totalPages": 8 }
  }
}
```

---

### `GET /api/issues/:id`

Returns full details for a single issue.

| Property | Value |
|---|---|
| Auth | Required |
| Roles | All authenticated roles |

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "issue": {
      "_id": "...",
      "status": "ASSIGNED",
      "reportedBy":    { "name": "Priya", "email": "...", "photoURL": "..." },
      "assignedWorker":{ "name": "Ravi",  "email": "...", "phone": "..." },
      "department":    { "name": "Roads", "code": "ROAD" },
      "images": [], "beforeImages": [], "afterImages": [],
      "location": { "type": "Point", "coordinates": [77.209, 28.614] }
    }
  }
}
```

**Errors:** `400` invalid ObjectId · `404` not found

---

### `PATCH /api/issues/:id`

Updates allowed fields. Role-based field whitelist enforced server-side.

| Property | Value |
|---|---|
| Auth | Required |
| Roles | All (field whitelist per role) |

**Role → editable fields:**

| Role | Editable fields |
|---|---|
| `CITIZEN` | `title`, `description` |
| `SUPER_ADMIN` / `DEPARTMENT_ADMIN` | `title`, `description`, `priority`, `status`, `department`, `assignedWorker`, `ward`, `dueDate` |
| `FIELD_WORKER` | `status`, `beforeImages`, `afterImages` |

**Errors:** `400` invalid ObjectId · `403` forbidden fields · `404` not found · `422` validation

---

### `DELETE /api/issues/:id`

| Property | Value |
|---|---|
| Auth | Required |
| Roles | `CITIZEN` (own REPORTED issue only), `SUPER_ADMIN` |

**Success `200`:**
```json
{ "success": true, "message": "Issue deleted successfully", "data": null }
```

**Errors:** `403` unauthorized · `404` not found

---

### `PATCH /api/issues/:id/assign`

Assigns a field worker to a verified issue. Transitions status to `ASSIGNED`.

| Property | Value |
|---|---|
| Auth | Required |
| Roles | `SUPER_ADMIN`, `DEPARTMENT_ADMIN` |

**Request body:**
```json
{
  "workerId": "<MongoDB ObjectId of FIELD_WORKER>",
  "note": "Assigned to Ward 15 repair team"
}
```

**Server-side validation (in order):**
1. Issue exists
2. Issue status is `VERIFIED` or `REOPENED`
3. `workerId` resolves to an existing user
4. That user's `role === 'FIELD_WORKER'`
5. That user's `isActive === true`
6. `DEPARTMENT_ADMIN`: worker dept must match admin dept

**Success `200`:**
```json
{
  "success": true,
  "message": "Worker assigned successfully",
  "data": { "issue": { "status": "ASSIGNED", "assignedWorker": { ... } } }
}
```

**Errors:**

| Status | Condition |
|---|---|
| `400` | `workerId` missing / user not a FIELD_WORKER / inactive |
| `403` | DEPARTMENT_ADMIN assigning across department |
| `404` | Issue or worker not found |
| `422` | Issue not in `VERIFIED` or `REOPENED` status |

---

### `POST /api/issues/:id/verify`

Citizen confirms or rejects the completed repair.

| Property | Value |
|---|---|
| Auth | Required |
| Roles | `CITIZEN` (original reporter only), `SUPER_ADMIN` |

**Request body:**
```json
{
  "verified": true,
  "note": "Pothole fully repaired. Road is smooth."
}
```

| Field | Required | Notes |
|---|---|---|
| `verified` | YES | `true` = approve, `false` = reject |
| `note` | If `verified=false` | Rejection reason required |

**Transitions:**
- `verified=true` → `CITIZEN_VERIFIED` → `RESOLVED` (auto-closed)
- `verified=false` → `REOPENED`

**Success `200`:**
```json
{
  "success": true,
  "message": "Issue verified and resolved. Thank you!",
  "data": { "issue": { "status": "RESOLVED", "resolvedAt": "..." } }
}
```

**Errors:**

| Status | Condition |
|---|---|
| `400` | `verified` missing |
| `400` | `verified=false` with no `note` |
| `403` | Not the original reporter |
| `404` | Issue not found |
| `422` | Issue not in `PENDING_CITIZEN_VERIFICATION` |

---

## 4. Worker Endpoints (`/api/workers`)

> All worker endpoints require `Authorization: Bearer <token>` with role `FIELD_WORKER`.

### `GET /api/workers/me`

Returns authenticated worker profile + live task stats.

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "Ravi Kumar", "role": "FIELD_WORKER", ... },
    "stats": { "activeTasks": 3, "completedTasks": 17 }
  }
}
```

---

### `GET /api/workers/me/tasks`

Lists only tasks assigned to this worker.

**Query parameters:** `status`, `page`, `limit`

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "tasks": [ { ... } ],
    "pagination": { "total": 5, "page": 1, "limit": 20, "totalPages": 1 }
  }
}
```

---

### `GET /api/workers/me/tasks/:id`

Full task detail + complete history timeline. `404` if not this worker's task.

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "task": { "_id": "...", "status": "IN_PROGRESS", ... },
    "timeline": [
      {
        "action": "ISSUE_REPORTED",
        "oldStatus": null, "newStatus": "REPORTED",
        "performedBy": { "name": "Priya", "role": "CITIZEN" },
        "note": "",
        "createdAt": "..."
      },
      {
        "action": "WORKER_ASSIGNED",
        "oldStatus": "VERIFIED", "newStatus": "ASSIGNED",
        "performedBy": { "name": "Admin", "role": "SUPER_ADMIN" },
        "note": "Assigned to Ward 15 repair team",
        "createdAt": "..."
      }
    ]
  }
}
```

---

### `PATCH /api/workers/tasks/:id/accept`

Transition: `ASSIGNED → ACCEPTED`

**Body (optional):** `{ "note": "..." }`

**Errors:** `403` not assigned to you · `422` wrong status

---

### `PATCH /api/workers/tasks/:id/start`

Transition: `ACCEPTED → IN_PROGRESS`

**Body (optional):** `{ "note": "On-site now." }`

---

### `PATCH /api/workers/tasks/:id/complete`

Transition: `IN_PROGRESS → PENDING_CITIZEN_VERIFICATION` (no images)

> Use `POST /proof` when submitting image evidence.

---

### `POST /api/workers/tasks/:id/proof`

Upload before/after images + repair note. Transitions to `PENDING_CITIZEN_VERIFICATION`.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Limits |
|---|---|---|---|
| `beforeImages` | file(s) | At least one of before/after | Max 5 files, 5 MB each, jpeg/png/webp |
| `afterImages` | file(s) | At least one of before/after | Max 5 files, 5 MB each, jpeg/png/webp |
| `repairNote` | string | NO | Free text |

**Success `200`:**
```json
{
  "success": true,
  "message": "Proof submitted successfully. Awaiting citizen verification.",
  "data": {
    "task": {
      "status": "PENDING_CITIZEN_VERIFICATION",
      "beforeImages": ["https://res.cloudinary.com/civicconnect/before/..."],
      "afterImages":  ["https://res.cloudinary.com/civicconnect/after/..."]
    }
  }
}
```

**Errors:**

| Status | Condition |
|---|---|
| `400` | No images provided |
| `400` | Wrong file type or file > 5 MB |
| `403` | Task not assigned to this worker |
| `404` | Task not found |
| `422` | Task not in `IN_PROGRESS` status |

---

## 5. Notifications (`/api/notifications`)

> All endpoints require authentication. Notifications are always scoped to `req.user._id`.

### `GET /api/notifications`

Returns paginated notifications for the current user.

**Query parameters:** `isRead` (boolean), `page`, `limit`

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "...",
        "type": "ISSUE_ASSIGNED",
        "title": "New Task Assigned",
        "message": "You have been assigned to fix a pothole on Ring Road.",
        "isRead": false,
        "relatedIssue": "...",
        "createdAt": "..."
      }
    ],
    "pagination": { "total": 12, "unreadCount": 4, "page": 1, "totalPages": 1 }
  }
}
```

---

### `PATCH /api/notifications/read-all`

Marks all unread notifications as read for the current user.

**Success `200`:**
```json
{ "success": true, "message": "All notifications marked as read", "data": { "modifiedCount": 4 } }
```

---

### `PATCH /api/notifications/:id/read`

Marks one notification as read. `403` if it belongs to a different user.

**Errors:** `400` invalid ObjectId · `403` ownership · `404` not found

---

## 6. Analytics (`/api/analytics`)

> All analytics endpoints require authentication. Data is role-scoped server-side.

### `GET /api/analytics/overview`

Role-scoped summary counts and status breakdown.

| Role | Scope |
|---|---|
| `SUPER_ADMIN` | Platform-wide |
| `DEPARTMENT_ADMIN` | Own department |
| `WARD_OFFICER` | Own ward |
| `FIELD_WORKER` | Own task totals |
| `CITIZEN` | Own reported issues |

**Roles allowed:** All

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "total": 142,
    "byStatus": { "REPORTED": 20, "VERIFIED": 15, "RESOLVED": 50 },
    "resolvedThisMonth": 18
  }
}
```

---

### `GET /api/analytics/issues`

Monthly trends, daily activity, ward breakdown, pipeline funnel.

| Property | Value |
|---|---|
| Roles | `SUPER_ADMIN`, `DEPARTMENT_ADMIN`, `WARD_OFFICER` |

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "monthlyTrend": [ { "month": "2026-07", "count": 34 } ],
    "dailyActivity": [ { "date": "2026-08-29", "count": 5 } ],
    "byCategory":   { "POTHOLE": 60, "GARBAGE": 30 },
    "byWard":       [ { "ward": "Ward 15", "count": 22 } ],
    "pipeline":     { "REPORTED": 20, "ASSIGNED": 30 }
  }
}
```

---

### `GET /api/analytics/workers`

Worker leaderboard (admins) or personal performance (field worker).

| Property | Value |
|---|---|
| Roles | `SUPER_ADMIN`, `DEPARTMENT_ADMIN`, `FIELD_WORKER` |

**Success `200`:**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      { "worker": { "name": "Ravi Kumar" }, "resolved": 24, "avgResolutionDays": 2.3 }
    ]
  }
}
```

---

## 7. Issue Status Workflow (FSM)

```
REPORTED ──► VERIFIED        SUPER_ADMIN, DEPARTMENT_ADMIN, WARD_OFFICER
         └─► REJECTED        SUPER_ADMIN, DEPARTMENT_ADMIN, WARD_OFFICER

VERIFIED ──► ASSIGNED        SUPER_ADMIN, DEPARTMENT_ADMIN
         └─► REJECTED        SUPER_ADMIN, DEPARTMENT_ADMIN

ASSIGNED ──► ACCEPTED        FIELD_WORKER (own task only)
ACCEPTED ──► IN_PROGRESS     FIELD_WORKER (own task only)
IN_PROGRESS ► PENDING_CITIZEN_VERIFICATION  FIELD_WORKER (own task only)

PENDING_CITIZEN_VERIFICATION
         ──► CITIZEN_VERIFIED  CITIZEN (own report), SUPER_ADMIN
         └─► REOPENED          CITIZEN (own report), SUPER_ADMIN

CITIZEN_VERIFIED ► RESOLVED   SUPER_ADMIN, DEPARTMENT_ADMIN (auto via /verify)
REOPENED ──► ASSIGNED         SUPER_ADMIN, DEPARTMENT_ADMIN

REJECTED → terminal (no further transitions)
RESOLVED → terminal (no further transitions)
```

---

## 8. Image Upload Rules

| Rule | Value |
|---|---|
| Allowed types | `jpeg`, `jpg`, `png`, `webp` |
| Max file size | **5 MB** per file |
| Max files per request | **5** (10 total for proof — 5 before + 5 after) |
| Storage | Cloudinary — HTTPS URLs only stored in MongoDB |
| Binary storage in DB | Never |
| API secret exposure | Never (server-side only) |

**Cloudinary folder structure:**
```
civicconnect/
  issues/   ← report images
  before/   ← before-repair evidence
  after/    ← after-repair evidence
```

---

## 9. Security Controls

| Control | How it's enforced |
|---|---|
| Authentication | Firebase ID Token verified server-side on every protected request |
| Role trust | `req.user.role` always from MongoDB — never from request body |
| Identity trust | `reportedBy`, `assignedWorker` always from `req.user._id` |
| ObjectId validation | `validateObjectId` middleware on all `/:id` routes |
| JSON body cap | `16 kb` limit (Express `express.json`) |
| Rate limiting | Global 200/15 min · Auth endpoint 15/15 min |
| CORS | Whitelist: `FRONTEND_URL` env var only |
| Security headers | Helmet applied globally |
| Department isolation | DEPARTMENT_ADMIN cross-department check in `assignmentService` |
| FSM enforcement | All status changes go through `transitionIssueStatus` — no direct writes |
