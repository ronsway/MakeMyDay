# SETUP – Using the Docs with GitHub Copilot

This file explains how to prime Copilot with the docs in `/docs` so it generates code aligned with ParentFlow’s MRD/PRD/architecture.

## 1) Prep the repository

Commit the docs first; assistants use workspace context.

## 2) Prime Copilot with context

Pin PRD, ARCHITECTURE, DATA_MODEL, API_SPEC. Add a bootstrap comment at the top of files with the feature scope and doc refs.

## 3) Prompt patterns

- Data models → Prisma/SQL from DATA_MODEL.md
- API scaffolding → Fastify + Zod from API_SPEC.md
- NLP microservice → FastAPI per ARCHITECTURE.md
- Notifications → workers + FCM per SYSTEM_DESIGN.md
- Educator dashboard → React + Vite per UX_FLOW.md
- Analytics → time_saved per PRD.md

## 4) Guardrails

- Privacy/PII redaction, i18n, tests baseline, shared error model, indexes.

## 5) Work plan (POC→MVP)

Create issues: parser, NLP, storage, parent UI, API, notify, dashboard, analytics, emergency, child mode, tests.

## 6) PR checklist

See `.github/PULL_REQUEST_TEMPLATE.md`.

## 7) ENV example

Use `docs/ENV.example` and never commit `.env`.

## 8) Validation before pilots

Dry-run parsers with anonymized WhatsApp exports; e2e ingest→parse→persist→notify.

## 9) Next docs

CONTRIBUTING.md, issue/PR templates, SECURITY.md, CI workflow.
