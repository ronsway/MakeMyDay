# API SPEC – ParentFlow (v1)

Status: Draft (MVP-aligned)  
Style: REST + JSON, JWT Bearer Auth (Supabase)  
Base URL: `https://api.parentflow.io/v1` (placeholder)  
Content-Type: `application/json; charset=utf-8`

## 0) Conventions

- **Auth:** `Authorization: Bearer <JWT>`
- **Pagination:** `?page=1&limit=20` + response `meta` block.
- **Errors:**

```json
{ "error": { "code": "string", "message": "string", "details": {} } }
```

- **Dates:** ISO 8601 (UTC). User TZ via `X-Timezone`.
- **RBAC:** `parent`, `child`, `educator`, `institution_admin`, `sys_admin`.

## 1) Auth

### GET /auth/me

Returns user profile.

### PATCH /auth/me

Update self (name, locale, timezone, notification_prefs).

## 2) Households & Children

### GET /households/:household_id

### POST /children

### PATCH /children/:child_id

## 3) Institutions & Classes

### GET /institutions/:id

### GET /institutions/:id/classes

### POST /classes/:class_id/enroll

## 4) Messages Ingestion

### POST /ingestion/messages

Accepts normalized payload and queues parsing.

### GET /messages/:id

Raw + parsed view.

## 5) NLP (internal)

### POST /nlp/parse

Proxy to FastAPI NLP service.

## 6) Tasks

### GET /tasks

Filters: user_id, child_id, date window, status, category.

### POST /tasks

Manual task creation.

### PATCH /tasks/:id

Update status/fields.

## 7) Events & Calendar

### GET /events

Household/class/institution scope.

### POST /events

Create event + reminders.

## 8) Notifications

### GET /notifications

### POST /notifications/test

### POST /notifications/snooze

## 9) Emergency

### POST /emergency/broadcast

Scope region/institution/class, actions: cancel events, suppress regular notifications.

### GET /emergency/broadcasts/:id/status

## 10) Educator

### POST /educator/messages

Create class announcement, optionally create tasks.

### GET /educator/messages/:id/engagement

## 11) Availability

### GET /availability/windows

Compute free windows and suggestions.

## 12) Analytics

### GET /analytics/time-saved

### GET /analytics/engagement

## 13) Duties (Fair Distribution)

### POST /duties/allocate

## 14) Haredi-friendly Channels

### POST /ivr/callout

### POST /sms/broadcast

## 15) Files

### POST /files

### GET /files/:id

## 16) Webhooks

### POST /institutions/:id/webhooks

## 17) Rate Limits

Default 60 req/min per IP; educator bulk 10 req/min.

## 18) Error Codes

auth.unauthorized, auth.forbidden, validation.failed, ingestion.duplicate, nlp.unprocessable, notfound, rate.limit, internal.
