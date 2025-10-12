# Contributing to ParentFlow

Thank you for your interest in contributing to ParentFlow! This document provides guidelines for contributing to our Hebrew language parent communication system.

## 👥 Project Team

- **[Ron Lederer](https://github.com/ronsway)** - Lead Developer
- **Dana Tchetchik** - Product Manager

## 🎯 Project Overview

ParentFlow is designed to help Israeli parents manage school communications more efficiently by using Hebrew Natural Language Processing to extract actionable tasks and events from parent group messages.

## Principles

Empathy first; clarity over cleverness; small commits; document everything; privacy by design.

## Workflow

- **Repository**: <https://github.com/ronsway/MakeMyDay.git>
- Branch from `main`: `git checkout -b feat/<name>`
- Issue-first development; PRs reference PRD or an Issue
- Run lint/tests before pushing

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ronsway/MakeMyDay.git
   cd MakeMyDay
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up development environment**

   ```bash
   npm run db:migrate
   npm start
   ```

## Standards

- **Languages**: TypeScript (web/backend), Hebrew NLP processing
- **Tools**: ESLint + Prettier; Vitest/Jest testing
- **Commits**: Conventional Commits format
- **RTL Support**: All UI components must support Hebrew right-to-left layout

### Hebrew/RTL Guidelines

- Ensure RTL compatibility for new UI components
- Use Hebrew-compatible fonts (Assistant, Open Sans Hebrew)
- Test with real Hebrew parent communication examples
- Maintain semantic meaning in Hebrew text processing

## Testing

- Unit + integration tests required
- Hebrew NLP test fixtures in `/tests/fixtures/`
- Test API endpoints with Hebrew data
- Version compatibility testing

### Running Tests

```bash
# Run all tests
npm test

# Run Hebrew NLP tests specifically
npm run test:nlp

# Test API endpoints
npm run test:api

# Check version compatibility
npm run version:check
```

## PR Checklist

- [ ] Linked to Issue/PRD
- [ ] Tests added/updated for Hebrew functionality
- [ ] Documentation updated
- [ ] No secrets/PII included
- [ ] Lint & CI green
- [ ] RTL layout tested (for UI changes)
- [ ] Hebrew text processing validated (for NLP changes)

## 🤝 Getting Help

- **GitHub Issues**: [Bug reports and feature requests](https://github.com/ronsway/MakeMyDay/issues)
- **Repository**: <https://github.com/ronsway/MakeMyDay.git>
- **Technical Questions**: Open a GitHub issue
- **Product Questions**: Mention Dana Tchetchik (Product Manager)
