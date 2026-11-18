---
title: "ExtrAI · Multimodal AI Document Extraction & Form Automation"
description: "Privacy-first intelligent automation platform using multimodal AI to extract Brazilian identity documents (RG, CNH, CIN) and auto-fill ICP-Brasil Digital Certification portals via Chrome Extension MV3."
lang: "en"
role: "Creator & Lead Software Engineer"
order: 1
featured: true
techs: ["Python", "FastAPI", "Pydantic v2", "PydanticAI", "Chrome Extension (MV3)", "Playwright", "Docker"]
metrics: [
  "95.4% reduction in processing time per issuance (~5m30s down to ~15s)",
  "Comprehensive test suite with 219 automated tests (unit and Playwright headless E2E)",
  "Privacy-by-Design architecture: zero PII persisted to disk with strict LGPD compliance"
]
githubUrl: "https://github.com/Mateusallz1/ExtrAI"
---

### Situation
During the issuance of Brazilian ICP-Brasil Digital Certificates (Soluti, Certisign, Valid, etc.), registration agents had to manually transcribe more than 10 complex fields from identification documents (RG, CNH, and CIN). The manual process took roughly 5.5 minutes per client, was prone to human typos (causing compliance rejections by ITI audit authorities), and faced portals with paste blockers (`Ctrl + V`) and asynchronous cascading dropdowns.

### Task
Design and build an end-to-end, privacy-compliant engineering solution to automate document parsing from scanned images and PDFs, validate all fields deterministically against federal business rules, and inject the sanitized data directly into legacy web portals.

### Action
- **High-Performance Async Backend:** Engineered a resilient backend using **FastAPI** and **Pydantic v2**, establishing strict data contracts and sub-second API latency.
- **Multimodal AI Pipeline with PydanticAI:** Orchestrated multimodal vision models to extract data from multi-page PDFs and images, backed by deterministic algorithmic validators (Mod 11 checksum calculation for CPFs and strict chronological sanity checks *Birth < Issue < Expiration*).
- **Chrome Extension Manifest V3:** Developed an autofill extension using synthetic native DOM events to bypass paste blockers, synchronize with dynamic AJAX state/city dropdowns, and trigger actions via global shortcuts (`Alt + P`).
- **Privacy by Design & Zero Trust:** Enforced a strict zero-PII disk policy. All documents and extracted data live ephemerally in volatile memory with automated monotonic TTL expiration (30 minutes), and zero personal data is recorded in logs.
- **Quality Engineering:** Implemented a test suite of **219 automated tests** combining Pytest and **Playwright** headless E2E automation, running fully offline without token consumption.

### Result
- **95.4% reduction in operational time per client**, dropping from ~5m30s to ~15 seconds.
- Over 44 hours of tedious manual data entry saved per year per operator.
- Completely eliminated audit rejections caused by transcription errors.
