---
title: "Distributed Task & REST API Platform"
description: "High-concurrency backend engine built with Django, PostgreSQL, and uv for processing asynchronous real-time events."
lang: "en"
role: "Backend Software Engineer"
order: 1
featured: true
techs: ["Python", "Django REST Framework", "uv", "PostgreSQL", "Redis", "TypeScript"]
metrics: [
  "Sub-50ms p95 latency on high-volume endpoints",
  "85% reduction in CI/CD build execution time using uv",
  "99.9% uptime across critical background task pipelines"
]
githubUrl: "https://github.com/Mateusallz1"
liveUrl: "https://github.com/Mateusallz1"
---

### Situation
The client required a resilient backend system capable of ingesting high volumes of real-time transactional payloads, validating records against complex business rules, and distributing notifications downstream.

### Task
Design an extensible REST API with rigorous automated test suites, efficient database access patterns, and automated deployment pipelines.

### Action
- Designed REST endpoints using **Django REST Framework** with strict serializer validation and OpenAPI documentation.
- Integrated **Astral uv** to manage virtual environments and dependencies, significantly accelerating CI build pipelines.
- Tuned PostgreSQL query plans using composite indices, `select_related`, and partitioned tables for historical event logs.
- Engineered task worker architecture using Celery and Redis to handle peak ingestion bursts gracefully.

### Result
- Maintained p95 latencies under 50ms across millions of monthly events.
- Achieved predictable, zero-flakiness builds with reproducible lockfiles.
