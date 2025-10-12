# System Architecture – ParentFlow

## Overview

ParentFlow is a cloud-based, event-driven architecture with modular components for scalability and cultural customization.

## Layers

1. **Frontend (React Native)**
   - Parent and Child apps.
   - Educator Web Portal (React + Vite).

2. **Backend (Node.js + Supabase)**
   - Fastify API gateway.
   - PostgreSQL database (via Supabase).
   - NLP microservice (Python FastAPI container).
   - Notification microservice (cron workers + Firebase Cloud Messaging).

3. **AI Layer**
   - OpenAI API for NLP and summarization.
   - Custom models fine-tuned for Hebrew context.

4. **Integration Layer**
   - WhatsApp Cloud API.
   - Email (IMAP/SMTP).
   - Telegram Bot API.
   - Optional Ministry of Education API.

5. **Deployment**
   - Dockerized microservices.
   - Hosted on AWS (ECS + RDS + S3).
   - CI/CD via GitHub Actions.

## Data Flow

User → Message Parser → NLP Service → Task Generator → Calendar DB → Notification Service → UI.
