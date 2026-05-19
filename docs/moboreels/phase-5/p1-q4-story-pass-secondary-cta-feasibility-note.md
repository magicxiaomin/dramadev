# Phase 5 P1 Q4 Feasibility Note — Story Pass secondary CTA default

Status: FEASIBILITY APPROVE for docs-only / fake-only planning. Product confirmation remains required before treating the Q4 default as an approved P1 product decision.

## Verdict

APPROVE, with no additional fake-only code, fixture, package, lockfile, CI, browser, backend, database, payment, subscription, login, Facebook API, analytics, video, deployment, DNS, secret, or NovelHub infrastructure work required now.

Keeping Story Pass secondary on the first locked episode across P0/P1 Facebook-ad campaign paths is feasible because it preserves the current PRD hierarchy: first-lock primary remains `Unlock EP X`, secondary remains `Get Story Pass`, and both fake unlock paths return to the same episode with `unlocked=1`.

## Summary

The existing Q4 decision packet and architecture gate are aligned with the PRD and Prototype B handoff. The repository already has fake-only runtime and e2e coverage showing the drawer CTA hierarchy and same-episode Story Pass round trip. The safe next gate is product-owner confirmation of the Q4 default, followed only by an optional reviewer/QA gate if product wants evidence for multiple inert attribution variants.

## Evidence reviewed

- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`:
  - §2 lines 20-37: Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> Unlock EP / Story Pass -> mock purchase / unlock -> return same episode.
  - §3 lines 43-58: no Home/Search/Show Detail first, no login before free preview, no Story Pass promotion before first lock, no Story Pass primary CTA at first lock, no real payment/subscription/Facebook/video, no competitor assets.
  - §5.5 lines 113-128: primary `Unlock EP X`; secondary `Get Story Pass`; rationale is lower-friction single-episode unlock first.
  - §5.6 lines 130-140 and §7 lines 160-209: return to same episode with `unlocked=1`; pass route preserves story/episode context.
  - §8.1 lines 230-237: no pre-free-playback login/recharge/Story Pass/PWA/home/detail redirect.
  - §15 lines 744-777: checklist requires drawer primary single-episode unlock, secondary Story Pass, same-episode mock returns, no Home/episode-context loss, CTA safe area.
- `docs/moboreels/prototype-b-spec.md` lines 1-3: Prototype B delegates implementation detail to the SceneFlow PRD.
- Existing Q4 docs-only artifacts prepared for packaging:
  - `docs/moboreels/phase-5/p1-q4-story-pass-secondary-cta-decision-packet.md`
  - `docs/moboreels/phase-5/p1-q4-story-pass-secondary-cta-architecture-gate.md`
  - `docs/moboreels/phase-5/p1-q4-story-pass-secondary-cta-feasibility-note.md`
- Supporting planning docs:
  - `docs/moboreels/phase-4g/phase-5-questions.md` line 12 asks whether Story Pass should stay secondary.
  - `docs/moboreels/phase-5/p1-decision-brief.md` lines 103-117 proposes yes, pending human product confirmation.
- Runtime/test spot check:
  - `src/app/variant-b/watch/[showId]/watch-stub.tsx` lines 344-358 renders primary `mock-unlock-episode-link` before secondary `story-pass-secondary-link`.
  - `src/app/variant-b/pass/pass-stub.tsx` lines 19-20 and 78-80 returns fake Story Pass purchase to the same episode.
  - `src/lib/query-params.ts` lines 112-139 builds watch/pass return hrefs and applies `unlocked=1` only for fake return.
  - `tests/e2e/variant-b-p0-facebook.spec.ts` lines 151-199 verifies first-lock mock unlock and Story Pass round trip preserve `source=facebook`, episode, and unlocked return.

## Key findings

1. Q4 is already PRD-preserving. The PRD explicitly forbids Story Pass primary at first lock and requires Story Pass as secondary there.
2. No new product ambiguity is introduced if Q4 only keeps the existing hierarchy. Product input is needed only to confirm the P1 default beyond the already-confirmed P0 PRD behavior.
3. Runtime does not appear to need a Q4 code change: the first-lock drawer already renders `Unlock EP X` / fake insufficient-balance primary first, then `Get Story Pass (mock)` second.
4. Existing e2e coverage already checks the default Facebook source path for Story Pass route and same-episode fake return. Extra tests would be additive only, mainly for inert attribution combinations if product wants broader evidence.
5. The Q4 docs-only artifacts are appropriately marked docs-only / fake-only / proposal pending product confirmation and do not authorize implementation.

## Hidden dependencies

- Product-owner confirmation is required before this becomes an approved P1 default for “all P0/P1 Facebook-ad campaign paths.”
- Any definition of “all campaigns” must remain fake-only and URL-param/inert-attribution scoped. It must not imply real Facebook campaign management, Pixel/CAPI, analytics, backend, or production ad infrastructure.
- If future campaigns introduce source/campaign-specific UI branching, a reviewer gate must confirm those params cannot flip first-lock CTA hierarchy.
- If insufficient fake-balance behavior is later exercised, the primary may become `Get coins to unlock` only within the PRD allowance; Story Pass still remains secondary and no real wallet/payment work is implied.

## Risks / mitigations

- CTA hierarchy regression risk: campaign optimization pressure may make Story Pass primary, default-selected, sticky, or visually dominant.
  - Mitigation: keep Q4 as a product-confirmed invariant; require reviewer signoff for any campaign/source CTA branching.
- Free-preview contamination risk: Story Pass education could leak into EP1-EP5 before the first lock.
  - Mitigation: acceptance criteria must continue to forbid Story Pass prompts before the first locked episode.
- Return-path risk: Story Pass fake purchase could strand the user on `/variant-b/pass`, go Home, or lose `episode`/`source` context.
  - Mitigation: retain same-episode pass return checks and do not alter query-param helpers without tests.
- Scope creep risk: Story Pass language can drift into subscription, renewal, cancellation, refund, tax, local pricing, account, or entitlement decisions.
  - Mitigation: keep all copy fake/mock and require human/legal/product gates for real monetization claims.
- Evidence ambiguity risk: one default route test may not prove future inert attribution combinations preserve hierarchy.
  - Mitigation: if product confirms Q4 and wants stronger evidence, add a narrow fake-only QA/reviewer task for optional attribution variants.

## Missing acceptance criteria / tests

No missing criteria block docs-only feasibility.

Recommended additions only if Q4 advances past product confirmation:

- Explicitly assert that source/campaign/ad/creative/placement/UTM params do not change first-lock CTA hierarchy.
- Verify `Get Story Pass` is secondary semantically and visually: second action position, secondary styling, not default-selected, not focused/preselected in a way that makes it primary.
- Verify no pre-lock Story Pass prompt/banner/interstitial appears during free episodes for all reviewed P0/P1 Facebook-ad paths.
- Verify Story Pass fake purchase returns to the same locked episode with `unlocked=1` and preserves safe attribution.
- Verify no real-service requests or production dependencies are introduced.

## Infrastructure boundary check

Within boundary:

- Docs-only feasibility note.
- Existing fake-only runtime and existing fake-only tests as evidence.
- Optional future additive fake-only docs/reviewer/QA checks after product confirmation.

Outside P0/P1 boundary / hard stop without separate explicit approval:

- Production deployment, DNS, cutover, secrets.
- Real payment, subscription, login, entitlement, wallet ledger, backend, database, analytics, Pixel/CAPI, Facebook API, video provider.
- Real Story Pass billing, renewal, cancellation, refund, tax, local pricing, legal/compliance, or brand-significant monetization decisions.
- NovelHub production infrastructure.
- Licensed, competitor, stock, public-domain, or otherwise uncleared assets/copy.

## Recommended plan edits

1. In the Q4 task graph, make product-owner confirmation the next required gate before dev/QA implementation-readiness language.
2. Keep “all campaigns” defined as fake-only P0/P1 Facebook-ad route/attribution contexts, not real Facebook campaign infrastructure.
3. Do not create a dev task for Q4 unless product confirms a need; the current runtime already preserves the PRD hierarchy.
4. If a QA task is created later, make it additive and narrow: default Facebook source plus optional inert attribution variants, no package/lockfile/browser-install changes unless explicitly authorized.
5. Any proposal to make Story Pass primary, visually dominant, default-selected, pre-lock, or campaign-specific at first lock must return to product/requirements review and should not proceed under this Q4 default.

## Safe next step

Product-owner gate: confirm, reject, or defer the Q4 proposal that Story Pass remains secondary on the first locked episode across all P0/P1 Facebook-ad campaign paths.

If product confirms it, the next safe technical gate is a reviewer/QA evidence package, not immediate dev work, unless product asks for a specific fake-only UI/test delta.

## Stop conditions

Stop and return to human/product/legal/security review if any follow-up proposes:

- Story Pass as primary, default-selected, visually dominant, sticky, required, or pre-lock promotional in the P0/P1 Facebook-ad path.
- Return paths that go Home, lose episode/source context, require login before free preview, or bypass the first-lock drawer.
- Real payment, subscription, login, entitlement, backend, database, analytics, Pixel/CAPI, Facebook API, video infrastructure, deployment, DNS/cutover, secrets, or NovelHub production infrastructure.
- Legal/compliance/pricing/tax/refund/cancellation/renewal/local-price or brand-significant monetization copy.
- Licensed, competitor, third-party, or uncleared assets/copy.
