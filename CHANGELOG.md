# Changelog

All notable changes to ParentFlow will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-12

### 🎉 Initial Production Release

ParentFlow is now production-ready! This release includes the complete Hebrew parent communication system with NLP capabilities.

### Added

#### Core Features

- **Hebrew NLP Engine** - Process Hebrew text from WhatsApp exports, emails, and manual input
  - Date parsing for Hebrew relative dates (מחר, השבוע הבא, ביום רביעי, etc.)
  - Weekday and month recognition in Hebrew
  - Action verb detection (להביא, לשלם, להכין, etc.)
  - Priority detection (חובה, נדרש, חשוב)
  
- **Message Processing Interface**
  - Interactive message processor component
  - Sample school messages for testing
  - Real-time task and event extraction
  - Hebrew RTL support throughout
  
- **Category Detection**
  - Equipment (ציוד ספורט, חולצה, נעליים)
  - Homework (שיעורי בית, מטלה, פרויקט)
  - Payments (תשלום, שקלים)
  - Gifts (מתנה, עוגה)
  - Events (טקס, ישיבת הורים, פעילות)

#### Technical Infrastructure

- **Version Management System**
  - Client-server version compatibility checking
  - Feature flags for gradual rollouts
  - Update notifications and banners
  - API versioning (v1)
  
- **Backend API**
  - Fastify server with TypeScript
  - Prisma ORM with SQLite database
  - RESTful endpoints for tasks, events, and analytics
  - Hebrew message ingestion endpoint
  - Timezone support (Asia/Jerusalem)
  
- **Frontend Application**
  - React 18 with TypeScript
  - Vite for fast development
  - RTL-optimized Hebrew interface
  - Responsive design for desktop and mobile
  - Real-time data updates

#### User Interface

- **Main Dashboard ("היום שלי")**
  - Today's tasks and events display
  - Task completion tracking
  - Analytics dashboard with time savings
  - Advanced analytics with feature flags
  
- **Message Processor**
  - Hebrew text input with RTL support
  - Sample message templates
  - Extracted tasks and events preview
  - Success/error handling

#### Analytics

- Time savings calculations
- Task and event statistics
- Daily/weekly progress tracking
- Advanced analytics (feature-flagged)

### Development Tools

- **Scripts**
  - `npm run dev` - Start both frontend and backend
  - `npm run build` - Production build
  - `npm run start:ps` - PowerShell startup script
  - `npm run version:check` - Version compatibility check
  
- **PowerShell Startup Script**
  - Automatic port cleanup
  - Concurrent frontend and backend launch
  - Process management utilities

### Documentation

- Complete POC specification
- API endpoint documentation
- Hebrew NLP parser documentation
- Contributing guidelines
- Authors and attribution

### Team

- **Ron Lederer** - Lead Developer
- **Dana Tchetchik** - Product Manager

### Repository

- GitHub: <https://github.com/ronsway/MakeMyDay.git>
- License: Proprietary
- Keywords: hebrew, nlp, parent-communication, school-messages, task-management, rtl

---

## [0.1.0] - Initial Development

### Added (Initial Setup)

- Initial project scaffolding
- Basic TypeScript configuration
- Development environment setup

---

## Release Notes

### Version 1.0.0 - Production Ready! 🚀

This is the first production release of ParentFlow, the Hebrew parent communication system that saves Israeli parents valuable time by automatically processing school messages.

**What's New:**

- Complete Hebrew NLP processing for school communications
- Automatic task and event extraction from messages
- Professional Hebrew RTL interface
- Enterprise-grade version management
- Real-time analytics and time savings tracking

**For Israeli Parents:**

- Simply paste WhatsApp messages from school groups
- Watch as tasks and events are automatically organized
- Never miss important dates or requirements again
- Save 2-3 minutes per message processed

**Technical Highlights:**

- Built with React + TypeScript + Fastify
- Hebrew date parsing and NLP
- Prisma + SQLite for data persistence
- Full RTL support throughout
- Version-controlled API with feature flags

**Getting Started:**

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open <http://localhost:5173>
5. Try the sample messages!

---

***Made with ❤️ for Israeli parents***
