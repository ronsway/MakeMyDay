# ParentFlow – MVP Specification (Minimum Viable Product)

**Status:** Authoritative spec for Phase 1 public pilots (post-POC)  
**Audience:** Engineering, Product, QA, DevOps, Data  
**Goal:** Ship a usable product for real parents and educators with stable workflows, basic analytics, and institutional controls.

---

## 1. Scope & Objectives

### 1.1 Primary Objectives

1. Multi-source ingestion (WhatsApp + Email; optional Telegram/SMS) → normalized messages.
2. Robust Hebrew NLP: tasks/events extraction with context & relative dates.
3. Parent app: “Today”, “This Week”, task management (done/snooze/edit), gentle reminders.
4. Educator web portal: single message → distributed to relevant parents; engagement metrics.
5. Notifications engine: multi-layer reminders (realtime, planned, contextual, follow-up).
6. Emergency/Bletam flow: broadcast & calendar reflow for closures/strikes/security/weather.
7. Time-saved analytics: per household monthly/weekly.
8. Data model migration to **PostgreSQL** (Supabase) and production-ready API.
9. Accessibility (RTL, Hebrew), privacy, logging, CI/CD, basic monitoring.

### 1.2 Explicitly Out of Scope (move to V1+)

- Deep recommendation engine for social matching.
- Full IVR/SMS automation for sectors without smartphones (provide admin tools only).
- Multi-language UI beyond Hebrew (i18n hooks present, English scaffolding allowed).
- Child standalone mobile app (child view within parent app only).

---

## 2. Architecture Overview

### 2.1 Components

| Component | Tech | Notes |
|-----------|------|-------|
| **Mobile/Web Parent App** | React Native (Expo) **or** React Web (Vite) | MVP can start Web-first; RN planned if feasible |
| **Educator Portal** | React (Vite) + React Query + Tailwind | Role: educator, institution admin |
| **API Gateway** | Node.js (Fastify) + Zod | JWT auth (Supabase Auth) |
| **NLP Service** | Python (FastAPI) | Hebrew parsing, date resolver, categorization |
| **Notifications** | Worker(s) + BullMQ or cron | FCM push + Email; SMS optional |
| **DB** | PostgreSQL (Supabase) | SQL migrations, RLS where applicable |
| **Storage** | S3-compatible | Files, exports, images |
| **CI/CD** | GitHub Actions | Build, test, deploy |
| **Monitoring** | Prometheus + Grafana (or Supabase metrics) | p50/95 latency, error rate, queues |

### 2.2 Deployment

- Containers (Docker) per service.
- Environments: `dev`, `staging`, `prod`.
- Config via environment variables; secrets in GitHub Actions + cloud secret manager.

---

## 3. Data Model (PostgreSQL)

### 3.1 Core Entities

- `users(id, email, name, role, household_id, locale, timezone, created_at)`
- `households(id, name, timezone, settings jsonb)`
- `institutions(id, name, address, type, contact jsonb)`
- `classes(id, institution_id, name, grade, age_range, created_at)`
- `enrollments(id, class_id, child_id, start_date, end_date)`
- `children(id, household_id, name, birthdate, grade, preferences jsonb)`
- `messages(id, source, raw_text, parsed jsonb, external_id, class_id, ts, hash, created_at)`
- `tasks(id, message_id, user_id, child_id, title, due_date, status, priority, category, notes, created_at, updated_at)`
- `events(id, title, start_time, end_time, location, class_id, household_id, institution_id, tags text[], created_at)`
- `notifications(id, user_id, type, payload jsonb, send_time, status, delivered_at)`
- `analytics_time(id, period, household_id, time_saved_minutes, signals jsonb, created_at)`

### 3.2 Indexing & Constraints

- `messages(hash)` unique for dedupe.  
- `tasks(user_id, child_id, due_date, status)` composite indexes.  
- `events(class_id, start_time)` and `events(household_id, start_time)`.  
- FK constraints with `ON DELETE SET NULL` where appropriate.  
- RLS policies (later) to restrict access by role/ownership.

### 3.3 Migration

- Prisma (or SQL) migrations from SQLite → PostgreSQL.
- Seed scripts for demo data.
- Backfill analytics from signals.

---

## 4. API (MVP)

**Standards:** REST, JSON, `Authorization: Bearer <JWT>`, `X-Timezone` optional.  
**Errors:** `{ "error": { "code": "string", "message": "string", "details": {} } }`  
**Pagination:** `?page=1&limit=20` + `meta` block.

### 4.1 Auth & Profile

- `GET /auth/me` – profile + roles.
- `PATCH /auth/me` – update name, locale, timezone, notification prefs.

### 4.2 Ingestion

- `POST /ingestion/messages` – accept batch payloads (`whatsapp|email|telegram|sms|manual`), enqueue parse.
- `GET /messages/:id` – raw + parsed view.

### 4.3 NLP (internal)

- `POST /nlp/parse` – FastAPI proxy; Hebrew intent/entity/date extraction.

### 4.4 Tasks

- `GET /tasks` – filters: user_id, child_id, from, to, status, category.
- `POST /tasks` – manual creation.
- `PATCH /tasks/:id` – update (status, title, due_date, priority, notes).
- `POST /duties/allocate` (educator) – fair distribution logic.

### 4.5 Events

- `GET /events` – household / class / institution scope.
- `POST /events` – create event + reminders.

### 4.6 Notifications

- `GET /notifications` – list.
- `POST /notifications/snooze` – snooze until datetime.
- `POST /notifications/test` – dev.

### 4.7 Educator Portal

- `POST /educator/messages` – class announcement; optionally create tasks.
- `GET /educator/messages/:id/engagement` – delivered/read/completed counts.

### 4.8 Emergency

- `POST /emergency/broadcast` – scope (class/institution/region), actions (cancel events, suppress regular notifications).
- `GET /emergency/broadcasts/:id/status` – delivery metrics per channel.

### 4.9 Analytics

- `GET /analytics/time-saved?household_id=...&period=YYYY-MM`  
- `GET /analytics/engagement?institution_id=...&from=...&to=...`

### 4.10 Files

- `POST /files` – signed upload URL.
- `GET /files/:id` – signed download URL.

---

## 5. Parent App (MVP UX)

### 5.1 Views

- **Today** – tasks due today, with quick actions (done/snooze/edit).
- **This Week** – tasks & events grouped by date.
- **Task Details** – title, due date, category, notes, source link.
- **Notifications Center** – upcoming reminders.
- **Settings** – timezone, quiet hours, notification channels.

### 5.2 Behaviors

- RTL by default, Hebrew text rendering.
- Snooze defaults: +1h, +3h, tomorrow morning 08:00.
- Gentle reminder logic: reduce noise (no duplicate pings for the same task).

---

## 6. Educator Portal (MVP UX)

### 6.1 Views

- **Compose Message** – title/body, attachments, class selection, “Create tasks from message” checkbox.
- **Class Status** – delivered/read/completed metrics, resend follow-up.
- **Emergency** – toggle broadcast with preview and scope selection.

### 6.2 Permissions

- Educator can reach only their classes.  
- Institution admin can broadcast to all classes in institution.

---

## 7. Notifications Engine

### 7.1 Types

- `realtime`, `planned`, `contextual`, `followup`, `emergency`

### 7.2 Scheduling

- Worker queue (BullMQ) or cron jobs. Idempotency via job keys.
- Quiet hours respected per profile.  
- Contextual reminders (e.g., night-before with prep list).

### 7.3 Delivery

- Push (FCM), Email (Nodemailer). SMS optional via provider stub.

---

## 8. Emergency/Bletam

- Broadcast payload updates calendars and optionally cancels events within window.  
- Suppress regular reminders during emergency window.  
- Dashboard shows broadcast state and last-mile delivery stats.

---

## 9. Analytics

### 9.1 Time Saved

- Same signal model as POC, refined counters:
  - `auto_parsed_messages`  
  - `auto_created_tasks`  
  - `completed_without_manual_entry`  
  - `deduped_duplicates`  
- Monthly & weekly aggregates.  
- Endpoint: `/analytics/time-saved`

### 9.2 Engagement

- Educator-level: delivered, read, completed per message/event.  
- Institution-level ranges.

---

## 10. Non-Functional Requirements

| Area | Requirement |
|------|-------------|
| Performance | p50 < 300ms, p95 < 800ms for API reads; ingestion queued |
| Availability | ≥ 99.0% |
| Security | JWT, HTTPS-only, TLS 1.3, PII redaction in logs |
| Privacy | Data minimization; configurable retention for raw messages |
| Observability | Structured logging, trace IDs, error rate alarms |
| Localization | Hebrew RTL; English scaffolding allowed |
| Accessibility | Semantic HTML, keyboard nav, color contrast |
| Backup | Daily DB snapshot; file storage versioning |
| Rate limiting | 60 req/min per IP; educator bulk endpoints 10 req/min |

---

## 11. Testing Strategy

### 11.1 Unit

- NLP entity & date resolver (Hebrew).
- API validation (Zod schemas).

### 11.2 Integration

- Ingest → NLP → Tasks/Events persistence.
- Reminders scheduling & delivery stubs.
- Educator message → engagement metrics.

### 11.3 E2E (staging)

- Demo flows: parent onboarding, educator announce, emergency broadcast.

### 11.4 QA Checklist

- RTL visuals, quiet hours respected, dedupe on duplicate messages, emergency suppression.

---

## 12. DevOps & CI/CD

- GitHub Actions: build/test on PR; deploy to staging on merge to `dev`, deploy to prod on tag `vX.Y.Z`.
- `.env` via secrets; no secrets in repo.
- Health checks: `/health` and queue depth checks.
- Rollbacks: previous container image kept; DB migrations with rollback scripts.

---

## 13. Security & Privacy

- Do not log raw `raw_text` unless `REDACT_RAW=false` in non-production only.
- Signed URLs for file uploads/downloads; expiration 15 min.
- RBAC enforced server-side; row-level constraints where possible.
- DPIA-lite: document collected fields and purposes per endpoint.

---

## 14. Acceptance Criteria (Go/No-Go for Pilot)

- Parents can see and complete tasks reliably (≥ 60% weekly active).
- Educators can send a class message and observe engagement metrics.
- Notifications arrive on time; quiet hours honored.
- Emergency broadcast updates calendars and suppresses regular reminders.
- Time-saved analytics produce monthly value (non-zero with correct counters).
- Error rate < 1% over 7 days in staging; p95 < 800ms for reads.

---

## 15. Backlog for Copilot (issue titles)

1. `feat(db): postgres schema + migrations (prisma/sql)`  
2. `feat(api): auth/me, ingestion/messages, tasks, events`  
3. `feat/nlp-svc`: FastAPI service (Hebrew intent/date) + tests  
4. `feat/notify`: worker queue + FCM + quiet hours  
5. `feat/edu-portal`: compose message + class status + follow-ups  
6. `feat/parent-app`: Today/Week views + task details + snooze  
7. `feat/emergency`: broadcast + calendar reflow + suppression  
8. `feat/analytics`: time-saved + engagement endpoints  
9. `chore/observability`: structured logs, error handler, health endpoints  
10. `ci`: GitHub Actions build/test/deploy pipelines

---

## 16. Code Header for New Files

```ts
/**
 * ParentFlow MVP
 * he-IL, RTL, TZ=Asia/Jerusalem
 * Security: JWT, HTTPS-only, no PII in logs
 * Validation: Zod schemas; typed endpoints
 * Tests required for core flows
 */
```

---

## 17. Example .env (staging)

```text
TZ=Asia/Jerusalem
DATABASE_URL=postgres://...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
FCM_SERVER_KEY=...
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
REDACT_RAW=true
QUIET_HOURS_FROM=21:30
QUIET_HOURS_TO=07:00
```

---

## 18. Rollout Plan

- Week 1–2: DB & API baseline; NLP service skeleton; portal scaffolding.
- Week 3–4: Notifications engine, parent views; initial educator flow.
- Week 5–6: Emergency flow; analytics; QA hardening; staging E2E.
- Week 7–8: Pilot institutions onboarding; monitor & iterate.
