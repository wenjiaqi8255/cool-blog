---
phase: 3
plan: 2
subsystem: Newsletter Backend
tags: [api, newsletter, resend, subscription]
dependency_graph:
  requires:
    - 03-01
  provides:
    - src/pages/api/subscribe.ts
    - src/pages/api/resend.ts
    - src/lib/email.ts
  affects:
    - src/components/interactive/SubscribeModal.tsx
tech_stack:
  added:
    - resend (email API)
    - zod (validation)
  patterns:
    - Server API endpoints with prerender = false
    - Zod schema validation
    - Email HTML templates
key_files:
  created:
    - src/pages/api/subscribe.ts
    - src/pages/api/resend.ts
    - src/lib/email.ts
  modified:
    - src/components/interactive/SubscribeModal.tsx
decisions:
  - Use fetch API for POST to /api/subscribe and /api/resend
  - Client-side email validation via regex check before API call
  - Show success/error states in modal UI (not alert())
  - Resend confirmation email via stored subscribed email (no re-entry needed)
  - Use @resend.dev test address in dev mode (no domain verification needed)
metrics:
  duration: 4min
  completed_date: "2026-03-30"
---

# Phase 3 Plan 2: Subscribe API Endpoint - Summary

Wired the existing SubscribeModal React component to backend API endpoints: replaced the stub with real fetch-based submission, client-side validation, success/error states, and resend functionality. Also created the Resend email utility.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Wire SubscribeModal to /api/subscribe with error/success/resend states | 8f32c61e | src/components/interactive/SubscribeModal.tsx |
| 2 | Create /api/subscribe endpoint with Zod validation, DB insert, email send | 8f32c61e | src/pages/api/subscribe.ts |
| 3 | Create /api/resend endpoint with subscriber lookup and email resend | 8f32c61e | src/pages/api/resend.ts |
| 4 | Create Resend email utility with styled HTML template | 8f32c61e | src/lib/email.ts |

## Implementation Details

### SubscribeModal.tsx Updates
- Added new state variables: error, success, isResending, resendSuccess, subscribedEmail
- Client-side email validation with regex before API call
- HandleSubmit now makes fetch POST to /api/subscribe
- Added handleResendConfirmation function for resending emails
- Updated UI to show success state with resend button instead of form

### /api/subscribe Endpoint
- Zod schema validation for email format
- Uses createSubscriber from lib/db.ts
- Sends confirmation email via sendConfirmationEmail
- Handles DUPLICATE_ERROR with 409 Conflict status
- All responses include Content-Type: application/json

### /api/resend Endpoint
- Zod schema validation for email format
- Lookup subscriber by email in database
- Update confirmationSentAt timestamp on resend
- Return 404 if email not found (security - don't reveal list membership)

### email.ts Utility
- Uses Resend SDK for sending emails
- Reads RESEND_API_KEY and RESEND_FROM_EMAIL from environment
- Falls back to newsletter@resend.dev in dev mode
- Sends styled HTML confirmation email with inline styles
- Logs errors but does NOT fail subscription on email error

## Verification Results

- SubscribeModal has 8 useState hooks (error, success, isResending, resendSuccess, subscribedEmail)
- Both API endpoints have prerender = false
- Zod validation using safeParse in both endpoints
- Resend button exists in modal
- Build passes successfully

## Requirements Addressed

- NEWS-01 (client-side validation): Implemented via regex check before API call
- NEWS-03 (confirmation message): Success state shows "You are subscribed!" with confirmation prompt
- NEWS-04 (resend): Resend button in success state allows resending confirmation email

## Deviation from Plan

- Fixed astro.config.mjs: Changed output from 'hybrid' to 'static' (Astro 6 deprecated hybrid)
- Added resend dependency via npm install --legacy-peer-deps

## Self-Check

- [x] All created files exist
- [x] Commit 8f32c61e exists
- [x] Build passes
