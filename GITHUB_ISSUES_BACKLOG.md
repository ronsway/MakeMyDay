# GitHub Issues Backlog for MVP

## Priority 1: Foundation (Week 1-2)

### Issue #1: PostgreSQL Schema + Migrations
**Title**: `feat(db): postgres schema + migrations (prisma/sql)`
**Labels**: `enhancement`, `database`, `priority:high`
**Milestone**: MVP Week 1

**Description**:
Migrate from SQLite to PostgreSQL with complete multi-user schema.

**Tasks**:
- [ ] Set up Supabase project
- [ ] Design PostgreSQL schema with all tables from MVP spec
- [ ] Create Prisma schema for PostgreSQL
- [ ] Add users, households, institutions, classes, enrollments, children tables
- [ ] Implement proper indexes and constraints
- [ ] Add Row Level Security (RLS) policies
- [ ] Create migration scripts from SQLite
- [ ] Write seed scripts for demo data
- [ ] Update connection strings in .env

**Acceptance Criteria**:
- All tables created with proper relationships
- Indexes on frequently queried columns
- FK constraints with proper cascade rules
- Seed data populates correctly
- Migration from SQLite successful

---

### Issue #2: Auth & Profile Endpoints
**Title**: `feat(api): auth/me, ingestion/messages, tasks, events`
**Labels**: `enhancement`, `api`, `priority:high`
**Milestone**: MVP Week 1-2

**Description**:
Implement Supabase authentication and user profile management.

**Tasks**:
- [ ] Integrate Supabase Auth
- [ ] Implement JWT middleware
- [ ] Create role-based access control (RBAC)
- [ ] Build `GET /auth/me` endpoint
- [ ] Build `PATCH /auth/me` endpoint
- [ ] Add household management
- [ ] Implement authorization checks
- [ ] Add auth tests

**Acceptance Criteria**:
- Users can authenticate with JWT
- Roles (parent, educator, admin) properly enforced
- Profile updates work correctly
- Auth middleware blocks unauthorized requests

---

## Priority 2: Core Services (Week 2-3)

### Issue #3: Python NLP Service
**Title**: `feat/nlp-svc: FastAPI service (Hebrew intent/date) + tests`
**Labels**: `enhancement`, `nlp`, `python`, `priority:high`
**Milestone**: MVP Week 2

**Description**:
Create separate Python FastAPI service for Hebrew NLP processing.

**Tasks**:
- [ ] Set up Python FastAPI project structure
- [ ] Port Hebrew NLP parser from TypeScript to Python
- [ ] Enhance date resolver with more Hebrew patterns
- [ ] Improve context awareness
- [ ] Add comprehensive testing suite
- [ ] Create Docker container
- [ ] Document API endpoints
- [ ] Add error handling

**Acceptance Criteria**:
- All POC NLP features work in Python
- New Hebrew patterns supported
- Tests cover edge cases
- Service runs in Docker
- < 200ms average response time

---

### Issue #4: Notifications Worker Queue
**Title**: `feat/notify: worker queue + FCM + quiet hours`
**Labels**: `enhancement`, `notifications`, `priority:high`
**Milestone**: MVP Week 3

**Description**:
Build multi-channel notification system with scheduling.

**Tasks**:
- [ ] Set up BullMQ job queue
- [ ] Implement FCM push notifications
- [ ] Add email notifications via Nodemailer
- [ ] Create notification scheduling logic
- [ ] Implement quiet hours respect
- [ ] Add snooze functionality
- [ ] Support notification types (realtime, planned, contextual, followup, emergency)
- [ ] Add delivery tracking

**Acceptance Criteria**:
- Notifications sent via FCM and email
- Quiet hours honored (21:30-07:00)
- Snooze works correctly
- Job queue handles failures gracefully
- Delivery status tracked

---

## Priority 3: User Interfaces (Week 3-4)

### Issue #5: Educator Portal
**Title**: `feat/edu-portal: compose message + class status + follow-ups`
**Labels**: `enhancement`, `frontend`, `educator`, `priority:high`
**Milestone**: MVP Week 3-4

**Description**:
Build educator web portal for class communication.

**Tasks**:
- [ ] Create React app with Vite + Tailwind
- [ ] Build message composer component
- [ ] Add class selection interface
- [ ] Create engagement metrics dashboard
- [ ] Implement batch message sending
- [ ] Add follow-up messaging
- [ ] Build class status view
- [ ] Add file attachment support

**Acceptance Criteria**:
- Educators can compose and send messages
- Class selection works
- Engagement metrics display correctly
- Follow-ups can be sent
- Mobile responsive design

---

### Issue #6: Enhanced Parent App
**Title**: `feat/parent-app: Today/Week views + task details + snooze`
**Labels**: `enhancement`, `frontend`, `parent`, `priority:high`
**Milestone**: MVP Week 4

**Description**:
Enhance parent interface with new views and functionality.

**Tasks**:
- [ ] Add "This Week" view
- [ ] Enhance "Today" view with better UX
- [ ] Create detailed task view with notes
- [ ] Implement snooze functionality (+1h, +3h, tomorrow)
- [ ] Add notification center
- [ ] Build settings page (timezone, quiet hours)
- [ ] Add multi-child support
- [ ] Implement task editing

**Acceptance Criteria**:
- Week view shows all upcoming tasks
- Task details fully editable
- Snooze presets work correctly
- Settings persist properly
- Multi-child households supported

---

## Priority 4: Advanced Features (Week 5-6)

### Issue #7: Emergency Broadcast System
**Title**: `feat/emergency: broadcast + calendar reflow + suppression`
**Labels**: `enhancement`, `emergency`, `priority:medium`
**Milestone**: MVP Week 5

**Description**:
Implement emergency (Bletam) broadcast system.

**Tasks**:
- [ ] Create emergency broadcast API
- [ ] Add scope selection (class/institution/region)
- [ ] Implement calendar event cancellation
- [ ] Add suppression of regular notifications
- [ ] Build emergency dashboard
- [ ] Add delivery metrics
- [ ] Create emergency templates
- [ ] Add rollback capability

**Acceptance Criteria**:
- Broadcasts reach all targeted users
- Events cancelled correctly
- Regular notifications suppressed during emergency
- Dashboard shows delivery status
- Can revert emergency actions

---

### Issue #8: Analytics Endpoints
**Title**: `feat/analytics: time-saved + engagement endpoints`
**Labels**: `enhancement`, `analytics`, `priority:medium`
**Milestone**: MVP Week 5-6

**Description**:
Build comprehensive analytics system.

**Tasks**:
- [ ] Implement time-saved calculations
- [ ] Add engagement tracking
- [ ] Create analytics dashboard
- [ ] Build monthly/weekly aggregates
- [ ] Add export functionality
- [ ] Create visualizations
- [ ] Implement institution-level metrics
- [ ] Add trend analysis

**Acceptance Criteria**:
- Time saved calculated accurately
- Engagement metrics per message
- Dashboard displays trends
- Data export works
- Performance acceptable for large datasets

---

## Priority 5: Infrastructure (Week 6-7)

### Issue #9: Observability & Monitoring
**Title**: `chore/observability: structured logs, error handler, health endpoints`
**Labels**: `infrastructure`, `monitoring`, `priority:medium`
**Milestone**: MVP Week 6

**Description**:
Add production-grade observability.

**Tasks**:
- [ ] Implement structured logging
- [ ] Add trace IDs to all requests
- [ ] Create error tracking (Sentry/similar)
- [ ] Build health check endpoints
- [ ] Set up Prometheus metrics
- [ ] Create Grafana dashboards
- [ ] Add alerting rules
- [ ] Implement log aggregation

**Acceptance Criteria**:
- All logs structured JSON
- Trace IDs track requests end-to-end
- Health checks on all services
- Alerts trigger on issues
- Dashboards show key metrics

---

### Issue #10: CI/CD Pipelines
**Title**: `ci: GitHub Actions build/test/deploy pipelines`
**Labels**: `infrastructure`, `ci/cd`, `priority:high`
**Milestone**: MVP Week 6-7

**Description**:
Set up complete CI/CD automation.

**Tasks**:
- [ ] Create GitHub Actions workflows
- [ ] Add build pipeline
- [ ] Add test pipeline
- [ ] Create staging deployment
- [ ] Create production deployment
- [ ] Add Docker image building
- [ ] Implement secrets management
- [ ] Add deployment health checks
- [ ] Create rollback procedures

**Acceptance Criteria**:
- PRs trigger build + test
- Merge to dev deploys to staging
- Tags deploy to production
- Secrets properly managed
- Rollback works

---

## Additional Backlog Items

### Issue #11: File Upload/Download
**Title**: `feat(api): file upload/download with signed URLs`
**Labels**: `enhancement`, `api`, `storage`

**Description**:
Implement S3-compatible file storage.

**Tasks**:
- [ ] Set up S3-compatible storage
- [ ] Create signed upload URLs
- [ ] Create signed download URLs
- [ ] Add file type validation
- [ ] Implement virus scanning
- [ ] Add file size limits
- [ ] Create cleanup job for old files

---

### Issue #12: Rate Limiting
**Title**: `feat(api): rate limiting and abuse prevention`
**Labels**: `enhancement`, `security`, `api`

**Description**:
Add rate limiting to prevent abuse.

**Tasks**:
- [ ] Implement IP-based rate limiting
- [ ] Add per-user rate limits
- [ ] Create educator endpoint limits
- [ ] Add burst handling
- [ ] Implement rate limit headers
- [ ] Create monitoring for rate limits

---

### Issue #13: E2E Testing
**Title**: `test: E2E tests for critical user flows`
**Labels**: `testing`, `priority:medium`

**Description**:
Create comprehensive E2E test suite.

**Tasks**:
- [ ] Set up Playwright/Cypress
- [ ] Test parent onboarding flow
- [ ] Test educator message flow
- [ ] Test emergency broadcast flow
- [ ] Test notification delivery
- [ ] Add CI integration
- [ ] Create test data fixtures

---

## Issue Templates

Save these as GitHub issue templates in `.github/ISSUE_TEMPLATE/`:

1. `feature-request.md`
2. `bug-report.md`
3. `mvp-task.md`

---

**Total Issues**: 13 core + additional backlog
**Timeline**: 8 weeks
**Team**: Ron Lederer (Lead Developer), Dana Tchetchik (Product Manager)
