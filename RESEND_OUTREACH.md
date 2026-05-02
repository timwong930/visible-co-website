# Resend outreach setup for Made Visibly

This repo now includes a Vercel Serverless Function at `api/send-outreach.js` that can send outreach emails with Resend.

## What you need to configure in Resend

1. Verify your sending domain in Resend.
2. Add the DNS records Resend gives you for the domain.
3. Use a sender like `tim@madevisibly.com` once the domain is verified.

## Vercel environment variables

Add these in the Vercel dashboard for the `visible-co-website` project:

- `RESEND_API_KEY`
- `OUTREACH_FROM_EMAIL` — for example `tim@madevisibly.com`
- `OUTREACH_FROM_NAME` — optional, defaults to `Made Visibly`

## Example request

```bash
curl -X POST https://madevisibly.com/api/send-outreach \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "owner@business.com",
    "subject": "Quick idea for your Google visibility",
    "text": "Hi — I took a quick look at your site and Google profile and noticed a few easy wins. If you want, I can send over a free audit with the fixes I would make first.",
    "businessName": "Northstar Home Services"
  }'
```

## Notes

- The endpoint accepts `text` and optionally `html`.
- If you only send `text`, the function builds a simple HTML version for you.
- This is ready to deploy now; it will work as soon as the env vars and Resend sender domain are in place.
