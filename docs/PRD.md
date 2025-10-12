# Product Requirements Document (PRD) – ParentFlow

## Product Overview

ParentFlow is a cross-platform mobile and web application designed to manage school-family communication through automation, smart reminders, and role-based dashboards.

## User Roles

- **Parent** – receives structured tasks and reminders.
- **Child** – learns responsibility through simplified tasks.
- **Educator** – sends a single update → system distributes to parents.
- **Institution** – manages dashboards, emergencies, and reports.

## Core Features

1. **Unified Message Parser**
   - Imports from WhatsApp, Telegram, Email, SMS.
   - NLP to detect dates, actions, and context.

2. **Smart Calendar**
   - Daily/weekly view.
   - Auto-reminders per urgency level.

3. **Child Mode**
   - Visual, gamified task board.
   - Responsibility tracking.

4. **Educator Dashboard**
   - Class-level management.
   - Auto-splitting messages per relevance.

5. **Emergency Mode**
   - Real-time updates for closures, weather, or security events.

6. **Cultural Adaptation**
   - Printable boards, IVR/SMS version for Haredi sector.

## Non-Functional Requirements

- Response < 300ms per API call.
- 99% uptime.
- Full encryption (AES256 at rest, TLS 1.3 in transit).
- GDPR and Israeli privacy compliance.

## MVP Scope

- Single-language (Hebrew) mobile app.
- WhatsApp + Email ingestion.
- Parent and educator dashboards.
- Basic NLP + manual correction.
