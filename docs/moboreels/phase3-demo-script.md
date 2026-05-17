# Phase 3 Stakeholder Demo Script

Linked task: PHASE3-012 (`t_26e2e615`)

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`

Supporting evidence:

- Phone preview handoff: `docs/moboreels/phase3-phone-preview.md`
- Walkthrough evidence: `docs/moboreels/phase3-acceptance/walkthrough.md`
- Mock-data freeze: `docs/moboreels/phase3-acceptance/mock-data-freeze.md`

## Demo boundary to say before starting

"This is a local, mock-only SceneFlow P0 demo at the phone reference size. I am not showing a production deployment, public URL, real Facebook integration, analytics, payment, subscription, login, backend, database, entitlement service, or real streaming video. The goal is to review whether the Facebook-ad conversion route is understandable on a phone and whether the mock unlock flow preserves episode context."

## 2-3 minute narration

"I am starting from the route a Facebook ad click would use in the P0 flow:
`/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook`.

This direct Watch-page landing is real prototype behavior in the local static build. The user starts on Episode 1, not Home, Search, or a detail page. The `source=facebook` value is mock routing context only; this demo does not call Facebook APIs, fire Pixel or CAPI events, or send analytics.

On Episode 1, the user can preview immediately. The story title, episode number, vertical watch area, progress surface, episode entry, detail entry, share entry, and continuation controls are prototype UI. The playback surface is mocked, not production video infrastructure. The acceptance point is that free preview begins without login, recharge, Story Pass, subscription, or install prompts.

Next, I will move through the free episode chain. Episodes 1 through 5 are the frozen mock free range for `Midnight Lantern Oath`, using local fixture data and original placeholder content. Each free episode can continue forward without payment, account creation, analytics consent, or subscription messaging.

Now we reach Episode 6, the first locked episode. This lock point is real prototype behavior driven by mock data: `freeEpisodes` is 5, so Episode 6 is locked unless the URL has the mock unlocked state. The Unlock Drawer opens automatically. It shows a mock balance of 80 coins, a mock cost of 36 coins, primary action `Unlock EP 6`, and secondary action `Get Story Pass`. No real wallet, entitlement ledger, purchase, renewal, cancellation, tax, refund, or payment processor is connected.

I will close the drawer with `Maybe later`. The app stays on locked Episode 6 instead of sending the user away. Tapping the locked playback area reopens the drawer, so the user keeps the drama and episode context.

Now I will use the primary mock unlock path. Selecting `Unlock EP 6` simulates success by returning to the same watch route with `unlocked=1`. That query parameter is the only unlock state in this demo; it is not a production entitlement or backend record. The acceptance point is same-episode return: Episode 6 is preserved, and the user is not sent to Home, the pass page, or a generic catalog surface.

For the secondary path, `Get Story Pass` opens the mock pass page for the same story and episode. It is static prototype UI, keeps context, and can return to Episode 6 with `unlocked=1`. There is no real subscription or purchase behind it.

The stakeholder takeaway is watch-first conversion: ad route to Episode 1, free preview chain, first locked episode, clear mock unlock choice, and same-episode return. Phase 3 validates the phone-sized acceptance package; it does not launch production infrastructure or make legal, brand, payment, or analytics claims."

## Optional close-out line

"If we accept this demo, the next review should focus on Phase 3 evidence completeness: screenshots, recording, checklist sign-off, known issues, and the phone-preview handoff. Any production hosting, public sharing, real payment, Facebook integration, analytics, login, video, or catalog work would be a separate later-phase decision."

## Mock vs real quick reference

| Demo element | Status |
| --- | --- |
| Local static route navigation | Real prototype behavior |
| EP1 landing from the Facebook-style route | Real prototype behavior |
| `source=facebook` attribution | Mock/static routing context only |
| Story metadata and episode list | Mock fixture data |
| Playback surface | Mock/static prototype surface, not real video infrastructure |
| Free EP1-EP5 chain | Real prototype behavior using mock fixtures |
| EP6 lock condition | Real prototype behavior using mock fixtures |
| 80 coin balance and 36 coin cost | Mock fixture values |
| Unlock Drawer interactions | Real prototype behavior with mock data |
| `unlocked=1` return | Mock unlock state only, not production entitlement |
| Story Pass page | Mock/static prototype UI |
| Payment, subscription, login, analytics, Facebook API, backend, database, video, NovelHub infra | Not implemented and not part of this demo |
