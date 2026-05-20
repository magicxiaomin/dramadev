# SceneFlow P0 demo route list

All routes are local/static prototype routes. Prefix with the active local origin only, for example `http://127.0.0.1:4173` or `http://<trusted-lan-ip>:4173` for same-LAN phone preview.

## Canonical required entry

```txt
/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
```

Purpose: Facebook-style ad entry into EP1 free preview. This is the exact route the demo must start from.

## Free preview chain

Use the in-app `Complete` then `Continue to EP N` controls. The generated route shape preserves attribution and increments the episode:

```txt
/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
/variant-b/watch/midnight-lantern-oath?episode=2&source=facebook
/variant-b/watch/midnight-lantern-oath?episode=3&source=facebook
/variant-b/watch/midnight-lantern-oath?episode=4&source=facebook
/variant-b/watch/midnight-lantern-oath?episode=5&source=facebook
```

Acceptance points:

- EP1 opens directly on Watch, not Home/Search/Show Detail.
- EP1-EP5 are free preview/free-chain states.
- No login, payment, subscription, Story Pass, recharge, PWA install, analytics, or Facebook prompt appears before the free preview.

## First locked episode and Unlock Drawer

```txt
/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook
```

Purpose: first locked episode. EP6 should show the locked state and open the Unlock Drawer automatically.

Unlock Drawer expected state:

- Story: `Midnight Lantern Oath`
- Episode: `EP 6`
- Mock balance: `80 coins`
- Mock single-episode cost: `36 coins`
- Primary CTA: `Unlock EP 6`
- Secondary CTA: `Get Story Pass`
- Tertiary/close CTA: `Maybe later` or close control
- Return copy says mock unlock returns to the same episode with `unlocked=1`

## Primary mock unlock return

```txt
/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1
```

Purpose: simulated successful single-episode unlock. This is fake-only URL state, not a production entitlement.

Acceptance points:

- Same story remains selected.
- Same EP6 remains selected.
- `source=facebook` is preserved.
- User is not sent to Home, Search, Show Detail, pass page, or a generic catalog surface.

## Story Pass mock round trip

Open from the EP6 Unlock Drawer secondary CTA:

```txt
/variant-b/pass?story=midnight-lantern-oath&episode=6&source=facebook
```

Return from the mock pass CTA:

```txt
/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1
```

Purpose: static mock Story Pass surface preserving story/episode/source context. It does not create a real subscription, renewal, cancellation, payment, wallet record, entitlement, login, backend record, analytics event, or Facebook event.

## Optional supporting local routes

These routes may be used only as supporting context, not as the P0 demo entry:

```txt
/variant-b
/variant-b/show/midnight-lantern-oath?episode=6&source=facebook
/variant-b/browse
/variant-b/search
```

Do not start the stakeholder demo from these supporting routes; the P0 route focus is watch-first entry into `/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook`.
