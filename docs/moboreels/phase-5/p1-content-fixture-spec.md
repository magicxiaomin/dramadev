# P1 Content Fixture Metadata Spec

Status: docs-only, fake-only, non-implementation proposal.

This document is a proposed contract for future review of fake/static per-drama fixture metadata. It is not an adopted runtime schema, not a backend/API contract, not a database schema, and not authorization to create or change runtime fixture files.

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.
Secondary source: `docs/moboreels/prototype-b-spec.md`.
Related planning inputs:

- `docs/moboreels/phase-4g/phase-5-questions.md`, especially Q18: content metadata for per-drama `freeEpisodes`, lock hooks, tags, episode ranges, and safe fake/test assets.
- `docs/moboreels/phase-4g/known-gaps.md`, especially the licensed/competitor assets gap.
- `docs/moboreels/real-mvp/roadmap.md`, for future gated real-MVP decisions only.

## 1. Purpose

P1 may need a clearer fake content fixture shape so the Watch page, Episode Sheet, Unlock Drawer, Pass page, and auxiliary Show Detail page can reason about the same per-drama metadata without inventing production infrastructure.

The proposed shape supports the PRD's fake-only P0 conversion invariant:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain
-> first locked episode
-> Unlock Drawer
-> fake unlock/pass
-> same episode with unlocked=1
```

This proposal answers Phase 5 Q18 at the documentation level only: what content metadata is needed to support per-drama `freeEpisodes`, lock hooks, tags, episode ranges, and safe fake/test assets.

## 2. Proposed typed shape

```ts
// Proposed docs-only contract. Do not import as runtime code.
type ProposedFakeDramaFixture = {
  showId: string;
  title: string;
  freeEpisodes: number;
  episodes: ProposedFakeEpisode[];
  tags: string[];
  passCopy?: ProposedFakePassCopy;
  fakeAssetPolicy: ProposedFakeAssetPolicy;
};

type ProposedFakeEpisode = {
  number: number;
  label: string;
  fakeDuration: string;
  lockHook?: string;
};

type ProposedFakePassCopy = {
  headline?: string;
  benefitBullets?: string[];
  helperText?: string;
};

type ProposedFakeAssetPolicy = {
  allowedSources: string[];
  disallowedSources: string[];
  approvalRequired: string[];
  notes?: string;
};
```

## 3. JSON example with placeholder-only content

This example is intentionally synthetic. It does not provide real titles, posters, videos, pricing, competitor copy, or production copy.

```json
{
  "showId": "fake-drama-alpha",
  "title": "Fake Drama Alpha",
  "freeEpisodes": 5,
  "episodes": [
    {
      "number": 1,
      "label": "EP 1",
      "fakeDuration": "01:20"
    },
    {
      "number": 2,
      "label": "EP 2",
      "fakeDuration": "01:15"
    },
    {
      "number": 6,
      "label": "EP 6",
      "fakeDuration": "01:30",
      "lockHook": "Placeholder lock hook for the first locked episode."
    }
  ],
  "tags": ["Fake Trope", "Synthetic Test Tag"],
  "passCopy": {
    "headline": "Keep watching Fake Drama Alpha",
    "benefitBullets": [
      "Placeholder story-specific benefit",
      "Fake-only pass copy for review"
    ],
    "helperText": "Fake unlock returns to the same episode."
  },
  "fakeAssetPolicy": {
    "allowedSources": [
      "Original synthetic text written for this prototype",
      "Simple generated placeholder graphics with documented generation prompt and no third-party marks",
      "Public-domain or permissively licensed assets only after human/legal/product approval",
      "Solid-color, gradient, or abstract local placeholder blocks created specifically for testing"
    ],
    "disallowedSources": [
      "Competitor drama titles, posters, videos, character names, pricing, or marketing copy",
      "Licensed film, TV, short-drama, music, actor, creator, platform, or stock assets without explicit approval",
      "Screenshots or downloads from competitor apps, ads, landing pages, social posts, or stores",
      "Real customer, creator, advertiser, or user data",
      "Any asset whose rights, provenance, or allowed usage cannot be documented"
    ],
    "approvalRequired": [
      "Human/legal/product approval before using any real, licensed, third-party, stock, public-domain, or externally sourced asset",
      "Product approval before adopting any story title, poster direction, lock hook style, or pass copy as brand-significant copy",
      "Legal approval before any production or public-traffic content source is used"
    ],
    "notes": "See docs/moboreels/phase-4g/known-gaps.md for the licensed/competitor asset risk. This proposal does not approve any asset source."
  }
}
```

## 4. Field-by-field traceability

| Field | Proposed meaning | Source / question mapping |
| --- | --- | --- |
| `showId` | Stable fake identifier used by Watch, Pass, Show Detail, Search, and Browse links. Must remain synthetic in P1 docs/fixtures. | PRD §7.1 default ad landing route `/variant-b/watch/[showId]?episode=1&source=facebook`; PRD §7.4 Pass route preserves `story=[showId]`; PRD §11 P0 includes Show Detail and secondary paths. |
| `title` | Fake drama title shown in Watch, Unlock Drawer, Pass page, and Show Detail. | PRD §5.4 transparent unlock shows drama title; PRD §8.1 Watch Page shows drama title; PRD §8.4 Unlock Drawer shows drama title; PRD §8.5 Pass page reframed around current drama; PRD §8.7 Show Detail includes context. |
| `freeEpisodes` | Per-drama lock point; episodes with `number > freeEpisodes` are locked unless fake-unlocked. | PRD §5.3 per-drama lock point; PRD §8.3 trigger condition `episode > story.freeEpisodes && unlocked !== true`; PRD §11 P0 per-drama lock point. Direct answer to Phase 5 Q18. |
| `episodes[]` | Ordered fake episode metadata for episode selector, current episode display, and free/locked state derivation. | PRD §8.1 current episode number and episode list entry; PRD §8.2 Episode Sheet current highlight, total episode count, free range, range tabs, episode grid; Phase 5 Q18 asks for episode ranges. |
| `episodes[].number` | Numeric episode identifier used by `episode` query params and lock comparisons. | PRD §7.2 locked episode route `episode=[episodeNumber]`; PRD §7.3 unlocked return route; PRD §8.3 lock trigger; PRD §8.6 return to same episode. |
| `episodes[].label` | Display label such as `EP 1`; fake UI copy only. | PRD §8.1 current episode number; PRD §8.2 Episode Sheet episode grid/current episode; PRD §8.4 locked state examples such as `EP 6 is locked`. |
| `episodes[].fakeDuration` | Synthetic display duration for mock/static playback UI only; not a real video duration. | PRD §8.1 vertical playback area/progress; PRD §12 P1 local continue-watching and episode completion tracking may need fake duration; Phase 5 Q18 safe fake/test assets. Not PRD authorization for real video. |
| `episodes[].lockHook` | Optional placeholder hook for locked episode copy, especially the first locked episode; absent values must fall back to generic fake copy. | PRD §8.4 Unlock Drawer story hook; PRD §16 asks whether every locked episode should have custom story hook; Phase 5 Q18 asks for lock hooks. |
| `tags` | Synthetic trope/genre tags for Watch, Detail, Search, Browse, and auxiliary discovery surfaces. | PRD §8.1 genre or trope tags; PRD §8.7 Show Detail tags; PRD §8.8 Search by title/trope/plot clue and Genre examples; Phase 5 Q18 asks for tags. |
| `passCopy` | Optional fake story-specific Pass page copy slot. It must stay clearly mock/fake and must not imply real subscription/payment terms. | PRD §8.5 Story Pass page: `Keep watching [Story Title]`, story-focused benefits, mock status, renewal/cancellation placeholders; PRD §12 P1 story-specific Pass page copy. |
| `passCopy.headline` | Optional fake Pass page headline tied to current drama. | PRD §8.5 recommended title `Keep watching [Story Title]`; PRD §12 story-specific Pass page copy. |
| `passCopy.benefitBullets` | Optional fake benefits for a story-focused pass; no real product terms. | PRD §8.5 Story Pass Option and story-focused benefits; Phase 5 questions Q11-Q12 keep real payment/subscription hard-stopped. |
| `passCopy.helperText` | Optional helper text that fake unlock/pass returns to the same episode. | PRD §5.6 return to same episode; PRD §8.5 where user goes after purchase; PRD §8.6 unlock success return. |
| `fakeAssetPolicy` | Per-fixture statement of allowed/disallowed fake asset sources and approval boundaries. | PRD §3 forbids copying competitor brands, titles, posters, videos, pricing, or copy; Phase 5 Q18 safe fake/test assets; Phase 5 Q19 asset policy; `phase-4g/known-gaps.md` licensed/competitor assets gap. |
| `fakeAssetPolicy.allowedSources` | Sources that may be considered for fake/test artifacts only, subject to the approval boundaries in this document. | Phase 5 Q18 safe fake/test assets; Q19 policy; known-gaps licensed/competitor asset risk. |
| `fakeAssetPolicy.disallowedSources` | Sources that must not enter prototype or production branches without explicit approval, and may be categorically forbidden for P1. | PRD §3 non-goal: no competitor brands/titles/posters/videos/pricing/copy; known-gaps licensed/competitor assets. |
| `fakeAssetPolicy.approvalRequired` | Human/legal/product approvals required before any non-synthetic or brand-significant asset/copy decision. | Phase 5 Q19 says human/legal approval required; real-MVP roadmap G3 launch content source and rights; known-gaps licensed/competitor assets. |

## 5. Asset policy

### Allowed in fake-only P1 planning, subject to review

- Original synthetic placeholder titles, tags, hooks, and pass-copy drafts written specifically for this prototype.
- Abstract local placeholder visuals such as solid colors, gradients, generic shapes, or wireframe blocks.
- Generated placeholder assets only when the prompt, provenance, and intended fake/test-only usage are recorded, and only if they do not imitate real brands, actors, creators, competitors, posters, videos, or ads.
- Public-domain, permissively licensed, stock, or third-party assets only after explicit human/legal/product approval. This document does not grant that approval.

### Disallowed without explicit later approval, and not authorized by this task

- Real short-drama titles, plots, actor likenesses, creator names, posters, videos, platform marks, pricing, subscription copy, ad creative, or landing-page copy.
- Competitor brands, titles, posters, videos, pricing, UX copy, screenshots, store listings, ads, social posts, or downloaded assets.
- Assets with unclear rights, missing provenance, incompatible licenses, or unreviewed usage restrictions.
- Real user, customer, advertiser, creator, or campaign data.
- Any real payment, subscription, entitlement, analytics, Facebook API, backend, database, login, video infrastructure, deployment, DNS, secrets, or production content-source artifact.

The licensed/competitor asset risk remains an explicit known gap in `docs/moboreels/phase-4g/known-gaps.md`. All content sourcing, rights, legal, compliance, and brand-significant copy decisions are deferred to human/legal/product approval.

## 6. P0 compatibility notes

- Lock semantics remain: `episode.number > freeEpisodes` means the episode is locked unless the fake review URL carries `unlocked=1` for that same episode.
- The first locked episode remains `freeEpisodes + 1` for a given `showId`, preserving the P0 route focus and PRD §5.3/§8.3 trigger condition.
- Fake unlock and fake Story Pass actions must return to the same drama and same episode with `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`, preserving PRD §5.6, §7.3, §8.5, and §8.6.
- The shape must not require login before free preview, must not show Story Pass before the first locked episode, and must not redirect Facebook ad users to Home/Search/Show Detail first.
- `passCopy` is optional so P0 can keep the single-episode unlock primary CTA and use generic fake copy until product approves story-specific pass language.

## 7. Non-goals and hard stops

This proposal does not authorize:

- Creating new runtime fixture files.
- Renaming or editing existing P0 fixtures.
- Schema migrations, database entities, backend/API contracts, production content services, or NovelHub production infrastructure.
- Real titles, posters, videos, copy, pricing, subscriptions, payments, login, Facebook APIs, analytics, entitlement, wallet ledger, or video infrastructure.
- Licensed, competitor, third-party, stock, public-domain, or otherwise externally sourced assets without explicit human/legal/product approval.
- CI, test, route, component, or runtime implementation changes.

## 8. Recommended review checklist before adoption

Before any future implementation task treats this proposal as an adopted fixture contract, require human/product/engineering review to answer:

1. Does the field list fully answer Phase 5 Q18 for fake-only P1 surfaces?
2. Are `lockHook` and `passCopy` safe enough as optional fake-copy slots, or should they stay hardcoded until product copy is approved?
3. Is `fakeDuration` sufficient for mock playback timing, or should P1 keep duration entirely UI-local?
4. Are episode range tabs derived from `episodes.length`, or should a separate fake range display field be proposed later?
5. Has legal/product approved any non-synthetic asset source? If not, only synthetic placeholder assets are allowed.
6. Does any proposed fixture content risk copying competitor assets or becoming brand-significant copy without approval?

Until those review questions are answered, this file remains a planning proposal only.
