# ParentFlow MVP Implementation Plan

## Current Status (v1.0.0 POC Completed ✅)

### What We Have (POC):
- ✅ Hebrew NLP parser with date resolution
- ✅ Basic task and event extraction
- ✅ Single-user web interface (MyDay)
- ✅ SQLite database with Prisma
- ✅ Fastify API server
- ✅ Version management system
- ✅ Message processor component
- ✅ Hebrew RTL interface

### What We Need for MVP:

## Phase 1: Database Migration (Week 1)
### 1. PostgreSQL Migration
- [ ] Set up Supabase project
- [ ] Create new PostgreSQL schema matching MVP spec
- [ ] Add multi-user support (users, households, institutions)
- [ ] Add class and enrollment tables
- [ ] Add children table
- [ ] Implement Row Level Security (RLS)
- [ ] Create migration scripts from SQLite to PostgreSQL
- [ ] Update Prisma schema
- [ ] Add proper indexing and constraints

**Files to Create/Modify:**
- `prisma/schema.prisma` (complete rewrite for PostgreSQL)
- `prisma/migrations/` (new migration files)
- `scripts/migrate-to-postgres.ts`
- `scripts/seed-demo-data.ts`

## Phase 2: Authentication & Multi-User (Week 1-2)
### 2. Supabase Auth Integration
- [ ] Set up Supabase Auth
- [ ] Implement JWT authentication
- [ ] Add role-based access control (parent, educator, admin)
- [ ] Create auth middleware for API
- [ ] Add household management
- [ ] Implement user profile endpoints

**Files to Create:**
- `server/auth/middleware.ts`
- `server/auth/rbac.ts`
- `server/auth/supabase.ts`
- Update `server/api.ts` with auth

## Phase 3: Enhanced NLP Service (Week 2)
### 3. Separate NLP Service
- [ ] Create Python FastAPI service
- [ ] Port Hebrew NLP from TypeScript to Python
- [ ] Enhance date resolver
- [ ] Add context awareness
- [ ] Improve category detection
- [ ] Add testing suite

**Files to Create:**
- `services/nlp/main.py`
- `services/nlp/parser.py`
- `services/nlp/date_resolver.py`
- `services/nlp/category_mapper.py`
- `services/nlp/requirements.txt`
- `services/nlp/Dockerfile`

## Phase 4: Notifications Engine (Week 3)
### 4. Multi-Channel Notifications
- [ ] Set up BullMQ for job queue
- [ ] Implement FCM push notifications
- [ ] Add email notifications (Nodemailer)
- [ ] Create notification scheduling
- [ ] Implement quiet hours
- [ ] Add snooze functionality
- [ ] Create notification types (realtime, planned, contextual, followup, emergency)

**Files to Create:**
- `services/notifications/worker.ts`
- `services/notifications/fcm.ts`
- `services/notifications/email.ts`
- `services/notifications/scheduler.ts`
- `services/notifications/queue.ts`

## Phase 5: Educator Portal (Week 3-4)
### 5. Educator Web Application
- [ ] Create educator portal (React + Vite)
- [ ] Message composition interface
- [ ] Class selection and management
- [ ] Engagement metrics dashboard
- [ ] Batch message sending
- [ ] Follow-up messaging

**Files to Create:**
- `educator-portal/` (new React app)
- `educator-portal/src/components/MessageComposer.tsx`
- `educator-portal/src/components/ClassStatus.tsx`
- `educator-portal/src/components/EngagementMetrics.tsx`

## Phase 6: Parent App Enhancement (Week 4)
### 6. Enhanced Parent Interface
- [ ] Convert to React Native (Expo) OR enhance web app
- [ ] Add "This Week" view
- [ ] Enhance task management (snooze, edit, notes)
- [ ] Add notification center
- [ ] Implement settings (timezone, quiet hours)
- [ ] Add multi-child support

**Files to Modify/Create:**
- `web/ThisWeek.tsx`
- `web/TaskDetails.tsx`
- `web/NotificationCenter.tsx`
- `web/Settings.tsx`
- `web/ChildSelector.tsx`

## Phase 7: Emergency/Bletam System (Week 5)
### 7. Emergency Broadcast
- [ ] Create emergency broadcast API
- [ ] Add scope selection (class/institution/region)
- [ ] Implement calendar reflow
- [ ] Suppress regular notifications during emergency
- [ ] Create emergency dashboard
- [ ] Add delivery metrics

**Files to Create:**
- `server/emergency/broadcast.ts`
- `server/emergency/calendar-reflow.ts`
- `server/emergency/suppression.ts`
- `web/emergency/Dashboard.tsx`

## Phase 8: Advanced Analytics (Week 5-6)
### 8. Analytics Enhancement
- [ ] Implement time-saved calculations
- [ ] Add engagement metrics
- [ ] Create analytics dashboard
- [ ] Add export functionality
- [ ] Implement monthly/weekly aggregates

**Files to Create:**
- `server/analytics/time-saved.ts`
- `server/analytics/engagement.ts`
- `web/analytics/Dashboard.tsx`
- `web/analytics/TimeS avedChart.tsx`

## Phase 9: DevOps & Infrastructure (Week 6)
### 9. Production Infrastructure
- [ ] Create Docker containers for all services
- [ ] Set up GitHub Actions CI/CD
- [ ] Configure staging environment
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Implement health checks
- [ ] Add error tracking
- [ ] Configure secrets management

**Files to Create:**
- `Dockerfile` (multiple for each service)
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-prod.yml`
- `docker-compose.yml`
- `k8s/` (Kubernetes configs if needed)

## Phase 10: Testing & QA (Week 6-7)
### 10. Comprehensive Testing
- [ ] Unit tests for all services
- [ ] Integration tests
- [ ] E2E tests for critical flows
- [ ] Performance testing
- [ ] Security audit
- [ ] Accessibility testing
- [ ] RTL testing

**Files to Create:**
- `tests/unit/`
- `tests/integration/`
- `tests/e2e/`
- `tests/performance/`

## Critical Dependencies

### External Services Needed:
1. **Supabase** - PostgreSQL + Auth
2. **Firebase** - FCM push notifications
3. **SMTP Provider** - Email notifications
4. **S3-compatible Storage** - File storage
5. **Monitoring** - Prometheus/Grafana or Supabase metrics

### Environment Variables Required:
```
TZ=Asia/Jerusalem
DATABASE_URL=postgres://...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
FCM_SERVER_KEY=...
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
STORAGE_BUCKET=...
STORAGE_KEY=...
REDACT_RAW=true
QUIET_HOURS_FROM=21:30
QUIET_HOURS_TO=07:00
JWT_SECRET=...
API_URL=...
```

## Acceptance Criteria for MVP

- [ ] Parents can register and see tasks from their children's classes
- [ ] Educators can send messages to their classes
- [ ] Multi-user households are supported
- [ ] Notifications arrive on schedule
- [ ] Quiet hours are respected
- [ ] Emergency broadcasts work and suppress regular notifications
- [ ] Analytics show time saved
- [ ] Engagement metrics are visible to educators
- [ ] System handles 100+ concurrent users
- [ ] p95 latency < 800ms
- [ ] Error rate < 1%
- [ ] All tests pass
- [ ] Security audit complete
- [ ] Accessibility requirements met

## Estimated Timeline

- **Week 1-2**: Database + Auth (16 hours)
- **Week 3-4**: NLP + Notifications + Educator Portal (24 hours)
- **Week 4-5**: Parent App + Emergency System (16 hours)
- **Week 5-6**: Analytics + DevOps (16 hours)
- **Week 6-7**: Testing + QA (16 hours)
- **Week 7-8**: Pilot preparation + iteration (16 hours)

**Total: ~104 hours over 8 weeks**

## Next Steps

1. Review this plan with team (Ron + Dana)
2. Set up Supabase project
3. Create GitHub issues from backlog items
4. Begin Phase 1: Database Migration
5. Set up project board for tracking

---

**Status**: Ready to begin MVP implementation
**Current Version**: 1.0.0 (POC Complete)
**Target MVP Version**: 1.1.0
**Pilot Release Target**: v2.0.0
