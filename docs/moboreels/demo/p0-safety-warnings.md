# SceneFlow P0 demo safety warnings

Use these warnings in the demo package, review notes, and capture handoff.

## Required warning

This is a local, static, fake-only P0 prototype. It must not use or expose real credentials, payment information, service secrets, user data, analytics events, Facebook API calls, backend records, database records, entitlement records, or production video infrastructure.

## Do not include in screenshots or recordings

- Access tokens, API keys, `.env` values, cookies, session IDs, service-account JSON, or other secrets.
- Real customer/user PII, phone numbers, emails, addresses, payment identifiers, subscription identifiers, order IDs, or wallet balances.
- Real Facebook Business/Ads account IDs, Pixel IDs, CAPI payloads, analytics dashboards, or attribution event payloads.
- Real Stripe/payment processor dashboards, tax/refund/cancellation records, subscription state, or card data.
- Production backend, database, bucket, Sentry/UptimeRobot/monitoring, R2/Supabase, or NovelHub infrastructure details.
- Licensed, competitor-derived, or brand-significant assets that have not been cleared for the demo.

## Safe to show

- Local route paths such as `/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook`.
- Localhost origins such as `http://127.0.0.1:4173`.
- Private same-LAN preview examples using placeholder IPs such as `http://<laptop-lan-ip>:4173`.
- Mock fixture values: `Midnight Lantern Oath`, EP1-EP5 free chain, EP6 first lock, `80 coins`, `36 coins`, and `unlocked=1`.
- Static prototype UI and original placeholder content.

## Language for demo narration

Use this boundary sentence before showing the flow:

“This demo is local and fake-only. It does not use production deployment, real credentials, payment, subscription, login, Facebook API, analytics, backend, database, entitlement, or video infrastructure. The unlock and Story Pass paths are mock UI only and return via local URL state.”

## Hard stops

Stop and ask for explicit human review before any of the following:

- Production deployment, DNS, cutover, or public preview URL.
- Public tunnel or tunnel token setup.
- Production secrets or external service credentials.
- Real payment, subscription, wallet, entitlement, login, analytics, Facebook API, backend, database, or video implementation.
- Legal/compliance, brand-significant, licensed-asset, or competitor-asset decisions.
- NovelHub production infrastructure implementation.

## Demo acceptance guardrails

The P0 demo must preserve this invariant:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

The demo must not:

- Return post-unlock users to Home.
- Lose the current episode context.
- Require login before free preview.
- Show payment, subscription, recharge, install, or pass prompts before free preview.
- Claim that `unlocked=1` is a real entitlement.
