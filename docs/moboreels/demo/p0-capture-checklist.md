# SceneFlow P0 screenshot and capture checklist

Scope: capture only the local/static fake-only prototype. Recommended reference viewport: 390 x 844.

Canonical flow:

```txt
/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook -> free episode chain -> EP6 first locked episode -> Unlock Drawer -> mock unlock/pass -> EP6 with unlocked=1
```

## Pre-capture setup

- [ ] Local static build is current.
- [ ] Local preview server is running against `out/` only.
- [ ] Browser or phone viewport is approximately 390 x 844.
- [ ] No production URL, tunnel, DNS, real credentials, payment account, Facebook account/API, analytics account, backend, database, or video service is used.
- [ ] URL bar or route metadata can be inspected enough to confirm route/context where required.

## Capture sequence

1. EP1 free preview / Facebook-style entry

   Route:

   ```txt
   /variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
   ```

   Capture:

   - [ ] EP1 opens directly on Watch.
   - [ ] Header or metadata shows `Facebook ad watch landing` / `source=facebook` context.
   - [ ] Free playback state is visible.
   - [ ] No login, recharge, Story Pass, subscription, PWA install, payment, analytics consent, or Facebook prompt appears before preview.

2. Free chain EP1 -> EP5

   Capture at least one transition, or capture each step if building a full walkthrough:

   - [ ] EP1 complete -> Continue to EP2.
   - [ ] EP2 complete -> Continue to EP3.
   - [ ] EP3 complete -> Continue to EP4.
   - [ ] EP4 complete -> Continue to EP5.
   - [ ] EP5 complete -> Continue to EP6.
   - [ ] Attribution/source context remains preserved.

3. EP6 first locked episode

   Route:

   ```txt
   /variant-b/watch/midnight-lantern-oath?episode=6&source=facebook
   ```

   Capture:

   - [ ] EP6 is the first locked episode.
   - [ ] Locked state is visually distinct from a network/error state.
   - [ ] Unlock Drawer opens automatically on first locked entry.
   - [ ] Closing the drawer keeps the user on locked EP6.
   - [ ] Tapping the locked playback area reopens the drawer.

4. Unlock Drawer

   Capture drawer contents:

   - [ ] Story title: `Midnight Lantern Oath`.
   - [ ] Episode: `EP 6`.
   - [ ] Mock balance: `80 coins`.
   - [ ] Mock cost: `36 coins`.
   - [ ] Primary CTA: `Unlock EP 6`.
   - [ ] Secondary CTA: `Get Story Pass`.
   - [ ] Close/tertiary action such as `Maybe later`.
   - [ ] Copy indicates mock unlock returns to the same episode with `unlocked=1`.
   - [ ] No real wallet, payment, subscription, backend, database, entitlement, login, analytics, or Facebook integration is implied.

5. Primary mock unlock return

   Route after clicking `Unlock EP 6`:

   ```txt
   /variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1
   ```

   Capture:

   - [ ] EP6 remains selected.
   - [ ] Unlocked/mock unlocked state is visible.
   - [ ] `source=facebook` remains preserved.
   - [ ] User is not returned to Home and does not lose episode context.

6. Story Pass mock round trip

   Start from locked EP6 drawer, click `Get Story Pass`:

   ```txt
   /variant-b/pass?story=midnight-lantern-oath&episode=6&source=facebook
   ```

   Capture:

   - [ ] Mock Story Pass page opens for `Midnight Lantern Oath` and EP6.
   - [ ] Page copy says it is local/mock only and not a real subscription/payment/entitlement.
   - [ ] Mock Story Pass return lands on:

     ```txt
     /variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1
     ```

   - [ ] Same story, same EP6, and `source=facebook` are preserved.

## Suggested filenames

For a full walkthrough, use stable ordered names:

```txt
01-ep1-facebook-entry.png
02-ep1-complete-continue.png
03-ep2-complete-continue.png
04-ep3-complete-continue.png
05-ep4-complete-continue.png
06-ep5-complete-continue.png
07-ep6-first-lock-unlock-drawer.png
08-ep6-drawer-closed-same-locked-episode.png
09-ep6-locked-area-reopens-drawer.png
10-ep6-primary-mock-unlocked-return.png
11-ep6-drawer-before-story-pass.png
12-story-pass-mock-page.png
13-ep6-pass-mock-unlocked-return.png
```

## Pass/fail rule

Pass only if the demo preserves the full P0 invariant and never sends the post-unlock user to Home, never loses the EP6 context, never requires login before free preview, and never shows payment/subscription/install prompts before free preview.
