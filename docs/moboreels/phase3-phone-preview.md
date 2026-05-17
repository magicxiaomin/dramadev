# Phase 3 Phone Preview Handoff

This handoff is for local, same-LAN stakeholder preview of the existing mock-only SceneFlow P0 route. It does not set up public hosting, tunneling, DNS, production secrets, analytics, payment, login, backend, database, video infrastructure, or NovelHub infrastructure.

## Scope

Preview the P0 Facebook ad conversion flow on a phone-sized viewport:

```txt
/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
```

Expected journey:

```txt
Facebook ad route -> EP1 free preview -> free episode chain -> EP6 first locked episode -> Unlock Drawer -> mock unlock/pass -> same EP6 route with unlocked=1
```

## Prerequisites

- Laptop and phone are on the same trusted LAN/Wi-Fi.
- Node/pnpm dependencies are installed for this repo.
- Run commands from the repository root.
- Do not use a public tunnel, public preview URL, DNS change, production deployment, or production secrets.

## Build and serve locally

Build the static export:

```bash
pnpm build
```

Serve the generated `out/` directory with a clean-URL-capable static server bound to all interfaces:

```bash
npx --yes serve@14.2.5 out -l tcp://0.0.0.0:4173
```

Why this command: the Phase 3 feasibility check confirmed `npx serve out` returns HTTP 200 for the extensionless Next static export routes. Do not document `python3 -m http.server --directory out` for this preview; it returns 404 for these extensionless routes with query strings.

## Find the phone URL

In another terminal, find the laptop LAN IP:

```bash
hostname -I
```

Pick the address reachable from the phone on the same Wi-Fi, then open this URL on the phone:

```txt
http://<laptop-lan-ip>:4173/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
```

Example only:

```txt
http://192.168.1.23:4173/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
```

If the phone cannot connect:

- Confirm laptop and phone are on the same LAN/Wi-Fi.
- Confirm the server command is still running.
- Confirm the command used `0.0.0.0`, not only `127.0.0.1`.
- Check the laptop firewall allows inbound LAN traffic to port `4173`.
- Do not work around this with a tunnel or public hosting in Phase 3.

## What to test on the phone

Use a mobile viewport or an actual phone. The reference viewport for acceptance evidence is 390 x 844.

1. Open the Facebook ad landing route:
   `http://<laptop-lan-ip>:4173/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook`
2. Confirm EP1 opens directly on the Watch page, not Home, Search, or Show Detail.
3. Confirm free preview starts without login, recharge, Story Pass, subscription, or PWA install prompt.
4. Use the episode-complete / continue CTA through the free chain.
5. Continue until EP6, the first locked episode.
6. Confirm the locked state is shown and the Unlock Drawer opens.
7. Confirm the Unlock Drawer shows:
   - Drama title: `Midnight Lantern Oath`
   - Episode: `EP 6`
   - Balance: `80 coins`
   - Cost: `36 coins`
   - Primary CTA: `Unlock EP 6`
   - Secondary CTA: `Get Story Pass`
   - Helper copy that unlock returns to this episode
   - Tertiary `Maybe later` / close action
8. Close the drawer with `Maybe later` and confirm the user remains on the locked EP6 context.
9. Tap the locked playback area and confirm the Unlock Drawer reopens.
10. Use `Unlock EP 6` and confirm the browser returns to the same episode with `unlocked=1`, for example:
    `http://<laptop-lan-ip>:4173/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1`
11. Confirm unlock success does not send the user to Home and does not lose the episode context.
12. Open the Episode Sheet from the Watch page and confirm it highlights the current episode, shows free episodes as playable, and shows locked episodes with an unlock condition.
13. Open the Story Pass option and confirm it preserves story and episode context before returning to the same unlocked episode path.

Optional local HTTP sanity checks from the laptop:

```bash
curl -I 'http://127.0.0.1:4173/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook'
curl -I 'http://127.0.0.1:4173/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1'
curl -I 'http://127.0.0.1:4173/variant-b/pass?story=midnight-lantern-oath&episode=6&source=facebook'
```

Each should return `HTTP/1.1 200 OK` or an equivalent 200 response.

## Regression check path

Run the local P0 acceptance wrapper before handing off or after any repo change:

```bash
bash acceptance/dramadev-p0.sh
```

The script is local-only and covers dependency guardrails, unit tests, lint, and build. It does not call external services.

## What is mocked

The preview is intentionally static and mock-only:

- Story metadata and episode list are local fixtures.
- Primary story: `Midnight Lantern Oath`.
- First free chain: EP1 through EP5.
- First locked episode: EP6.
- Mock balance: `80 coins`.
- Mock per-episode cost: `36 coins`.
- Mock unlock state is represented by the URL query parameter `unlocked=1`.
- Story Pass / unlock options are prototype UI only.
- Playback is a static prototype surface, not real streaming video.
- Facebook `source=facebook` is preserved as routing context only; no Facebook API, Pixel, CAPI, or attribution events are sent.
- No real payment, subscription, wallet ledger, entitlement, login, analytics, backend, database, or NovelHub production infrastructure is used.

## Explicit Phase 3 boundaries

Allowed:

- Local static build.
- Local same-LAN preview from a laptop to a phone.
- Local acceptance screenshots, recording, or checklist evidence.
- Mock-only route verification.

Not allowed in this handoff:

- Production deployment, DNS, cutover, or public URL.
- Public tunneling or tunnel secrets.
- Production environment variables, service accounts, or secrets.
- Real payment, subscription, wallet, entitlement, login, analytics, Facebook API, video, backend, or database implementation.
- Licensed, competitor-derived, or brand-significant assets.
