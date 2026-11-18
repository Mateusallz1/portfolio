---
title: "Documentei · Enterprise Regulatory & Licensing Monitoring Platform"
description: "Production web platform built with Django 6 and Python 3.13 featuring Docker containerization, asynchronous background collection workers, immutable audit logging, and municipal licensing monitoring."
lang: "en"
role: "Lead Software Architect & Backend Engineer"
order: 2
featured: true
techs: ["Python", "Django 6", "Docker", "uv", "Caddy", "SQLite", "Pytest", "Tailwind CSS"]
metrics: [
  "Comprehensive suite with over 1,100 automated unit, integration, and security tests",
  "Automated tracking of corporate municipal licenses, risk levels, and regulatory compliance",
  "Immutable transactional Audit Trail logging all document requests, downloads, and events"
]
githubUrl: "https://github.com/Mateusallz1/Documentei"
liveUrl: "https://slic.consultcontabil.com"
---

### Situation
Accounting offices and corporate service providers in Brazil manage hundreds of municipal business licenses (SLIC), operating permits (alvarás), and industry risk-level classifications. This process was historically handled through fragmented spreadsheets and manual web portal queries, leading to high operational overhead and the persistent risk of missed renewals and regulatory penalties.

### Task
Architect and deploy an enterprise-grade, resilient web platform to monitor client licensing portfolios, automate background data collection and synchronization from municipal portals, enforce strict compliance auditing, and deliver an intuitive dashboard for internal teams.

### Action
- **Backend Architecture with Django 6 & Python 3.13:** Engineered bounded domain contexts (`licensing`, `companies`, `audit`, `processes`) with rigorous business logic, managed via Astral `uv`.
- **Dockerized Dual-Service Architecture:** Designed a unified Docker image powering both the web frontend and an asynchronous background worker, coordinated via database-level locks and rate limiters to prevent concurrency conflicts and avoid upstream rate limiting.
- **Immutable Audit Trail:** Implemented a transactional audit subsystem capturing document requests, status transitions, worker executions, and permit downloads with cryptographic non-tampering guarantees.
- **Defensive Application Security:** Enforced fail-closed authentication, rate-limited login endpoints against brute-force attacks, XML parsing security for upstream responses, and automated CI pipelines with Bandit and Gitleaks scanning.
- **Production VPS Deployment:** Deployed the solution on a Linux VPS behind a Caddy reverse proxy with automatic TLS certificate lifecycle management and automated backup/restore verification.
- **Quality Assurance:** Authored a test suite exceeding **1,100 automated tests** using Pytest, relying on synthetic datasets and deterministic HTTP mocks to guarantee regression-free releases.

### Result
- Fully eliminated error-prone manual spreadsheets, consolidating the entire portfolio into a real-time operational dashboard.
- Saved dozens of manual consulting hours per week while preventing compliance penalties caused by expired permits.
- Established a complete, tamper-proof audit trail for corporate governance and regulatory compliance.
