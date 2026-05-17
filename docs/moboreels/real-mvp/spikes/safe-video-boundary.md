# SceneFlow Real MVP — Spike 4 Safe Video Sample / Provider Boundary

- Linked task: PHASE4C-004 (`t_545a3c31`)
- Source plan: `docs/moboreels/real-mvp/spike-plan.md` §4 Spike 4
- Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
- Secondary context: `docs/moboreels/real-mvp/prd.md` §4.2 and `docs/moboreels/real-mvp/architecture.md` §3.5 / §3.11
- Status: Spike spec, staging-only / local-only. No production video infrastructure is authorized.
- Last updated: 2026-05-17

## 1. Purpose

Prove that the SceneFlow Watch shell can keep playback state separate from entitlement / locked state while using only original or legally safe sample media.

The spike is successful when a reviewer can see a concrete provider interface, a mapping from provider state to Watch shell UI state, a mobile viewport checklist, explicit stop conditions, and a go/no-go recommendation for later implementation planning.

## 2. Scope boundary

### 2.1 Allowed in this spike

- Documentation-only provider boundary and state mapping.
- Local or staging-safe proof using original placeholder media only.
- Browser-native playback behavior for a local/static MP4 or equivalent safe sample asset.
- Poster / thumbnail metadata that is original placeholder art, generated neutral gradient, or a frame from original sample media.
- Explicit distinction between playback states (`loading`, `playing`, `paused`, `buffering`, `ended`, `error`) and product access states (`free`, `locked`, `unlocked`).
- Mobile-first review at the PRD reference viewport: 390 x 844.

### 2.2 Not allowed / hard stops

Stop and request explicit approval before any work that requires:

- Competitor, licensed, scraped, unclear, or brand-significant video, poster, audio, subtitle, music, title, or copy.
- Production CDN, object storage, video ingest, transcoding, encoding ladder, signed playback URLs, DRM, or persistent media pipeline.
- Production backend, database, entitlement service, auth, payment, subscription, Facebook API, analytics, deployment, DNS, secrets, or NovelHub production infrastructure.
- A vendor decision that treats HLS, CDN, storage, DRM, captioning, encoding, or a commercial player as approved.
- Removing mock/staging disclaimers or implying the sample video is launch content.

## 3. Source invariants to preserve

| Invariant | Required behavior |
| --- | --- |
| Watch-first ad route | `/variant-b/watch/[showId]?episode=1&source=facebook` remains the P0 entry path. |
| Free preview first | Free episodes play without login, recharge, Story Pass, subscription, PWA install prompt, or Home redirect. |
| Per-drama lock point | `episode > story.freeEpisodes && !unlocked` enters the locked state. |
| Locked is not playback error | Locked state must look product-gated, not like buffering, offline, or decode failure. |
| Same-episode return | After mock unlock or pass, return to `/variant-b/watch/[showId]?episode=[episode]&unlocked=1`. |
| `unlocked=1` is UX only | The URL flag may support mock / post-unlock UX, but it is not a future authority to access real video. |
| Attribution continuity | `source` and safe future attribution params must not be dropped by playback controls or episode navigation. |

## 4. Proposed boundary model

The Watch shell owns route, product chrome, episode list, locked state, Unlock Drawer, pass links, attribution preservation, and same-episode return.

The playback provider owns media loading and playback lifecycle only. It never decides whether an episode is locked and it never grants access.

```txt
/variant-b/watch/[showId]?episode=N&source=facebook
        |
        v
Watch shell
  - parse route/query
  - load story + episode fixture/provider data
  - compute access state: free | locked | unlocked
  - render product chrome, drawer, episode sheet, progress UI
  - only if access state is playable:
        |
        v
Playback provider boundary
  - load safe sample source
  - emit playback state + progress + metadata
  - never decides entitlement
```

### 4.1 Access-state gate before playback

```ts
type WatchAccessState =
  | { kind: "free"; reason: "within_free_episode_range" }
  | { kind: "locked"; reason: "first_or_later_locked_episode" }
  | { kind: "unlocked"; reason: "mock_unlocked_url_flag" };
```

Rules:

1. If access state is `locked`, the shell does not call `provider.load()` for the locked episode's playable source.
2. Locked state renders the locked product UI and opens / reopens the Unlock Drawer.
3. If access state is `free` or `unlocked`, the shell may mount the playback provider with a safe local/static sample source.
4. Playback provider errors never convert to locked state. They render as playback errors only.
5. Locked state never converts to playback error. It remains a product access state with unlock CTAs.

## 5. Playback provider interface draft

This is a TypeScript-shaped contract for a future implementation. It is not a production SDK selection.

```ts
type PlaybackProviderName = "browser-static-sample" | "future-provider";

type PlaybackSource = {
  id: string;
  showId: string;
  episodeNumber: number;
  kind: "safe_sample_mp4" | "safe_sample_hls" | "future_signed_stream";
  url: string;
  mimeType: "video/mp4" | "application/vnd.apple.mpegurl" | string;
  durationSeconds?: number;
  poster?: PlaybackPosterMetadata;
  captions?: PlaybackCaptionTrack[];
  rights: SafeSampleRights;
};

type SafeSampleRights = {
  status: "original_placeholder" | "public_domain_confirmed" | "licensed_for_scene_flow_staging";
  owner: string;
  evidence: string; // local doc path, generation note, or signed rights reference
  launchUseApproved: false; // this spike does not approve launch use
};

type PlaybackPosterMetadata = {
  url: string;
  alt: string;
  rights: SafeSampleRights;
};

type PlaybackCaptionTrack = {
  src: string;
  srclang: string;
  label: string;
  rights: SafeSampleRights;
};

type PlaybackCommand =
  | { type: "load"; source: PlaybackSource; startAtSeconds?: number }
  | { type: "play" }
  | { type: "pause" }
  | { type: "seek"; seconds: number }
  | { type: "destroy" };

type PlaybackProviderState =
  | { kind: "idle" }
  | { kind: "loading"; sourceId: string }
  | { kind: "ready"; sourceId: string; durationSeconds?: number }
  | { kind: "playing"; sourceId: string; currentTimeSeconds: number; durationSeconds?: number }
  | { kind: "paused"; sourceId: string; currentTimeSeconds: number; durationSeconds?: number }
  | { kind: "buffering"; sourceId: string; currentTimeSeconds: number; weakNetwork: boolean }
  | { kind: "ended"; sourceId: string; durationSeconds?: number }
  | { kind: "error"; sourceId?: string; code: PlaybackErrorCode; recoverable: boolean; message: string };

type PlaybackErrorCode =
  | "source_not_found"
  | "unsupported_format"
  | "decode_error"
  | "network_error"
  | "timeout"
  | "unknown";

type PlaybackProviderEvent =
  | { type: "state"; state: PlaybackProviderState }
  | { type: "timeupdate"; currentTimeSeconds: number; durationSeconds?: number }
  | { type: "progress"; bufferedEndSeconds?: number; durationSeconds?: number }
  | { type: "ended" }
  | { type: "error"; error: Extract<PlaybackProviderState, { kind: "error" }> };

interface PlaybackProvider {
  readonly name: PlaybackProviderName;
  readonly capabilities: {
    canAutoplayMuted: boolean;
    supportsInlinePlayback: boolean;
    supportsHlsNatively: boolean;
    supportsCaptions: boolean;
  };
  load(source: PlaybackSource, options?: { startAtSeconds?: number }): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  seek(seconds: number): Promise<void>;
  destroy(): void;
  subscribe(listener: (event: PlaybackProviderEvent) => void): () => void;
}
```

### 5.1 Provider responsibilities

- Validate that a source exists and is playable by the browser / staging sample provider.
- Emit state transitions and progress updates.
- Surface weak-network / buffering separately from decode / source errors.
- Provide poster and caption metadata to the shell where available.
- Clean up media listeners on route / episode change.

### 5.2 Provider non-responsibilities

- No entitlement decisions.
- No payment, login, wallet, subscription, or Story Pass decisions.
- No attribution preservation or route construction.
- No production signed URL generation.
- No upload, transcode, CDN, storage, DRM, or vendor selection.
- No use of `unlocked=1` as an authority.

## 6. Provider-to-Watch-shell state mapping

| Access state | Provider state | Watch shell UI | Drawer / CTA behavior | Notes |
| --- | --- | --- | --- | --- |
| `free` | `idle` / `loading` | Vertical player skeleton with safe poster and loading affordance. | No drawer. | Must not show login/recharge/pass prompt. |
| `free` | `ready` / `playing` | Free preview player, play/pause, progress, episode metadata, episode sheet/detail/share entries. | No drawer. | User confirms this is the ad drama immediately. |
| `free` | `paused` | Same player chrome, paused affordance. | No drawer. | Paused is not locked. |
| `free` | `buffering` | Weak-network / buffering indicator in player area. | No drawer. | Must be visually distinct from locked. |
| `free` | `ended` | Episode complete overlay and `Continue to EP X` CTA. | If next episode locked, next navigation opens drawer on the next episode. | Manual continuation remains acceptable. |
| `free` | `error` | Playback error panel with retry / maybe reload copy. | No unlock drawer. | Error must not imply payment solves it. |
| `locked` | not loaded | Locked episode panel: `EP X is locked`, story hook, product-gated styling. | Unlock Drawer auto-opens on first entry; tap player area reopens. | Provider should not load a playable source. |
| `locked` | any provider state | Treat as invalid composition; shell should unmount provider and render locked panel. | Drawer behavior follows locked state. | Prevents accidental playback behind lock. |
| `unlocked` | `loading` / `playing` | Unlocked episode player plus short success feedback if coming from mock unlock. | Drawer closed. | `unlocked=1` is UX hint only in this spike. |
| `unlocked` | `ended` | Episode complete overlay and next episode CTA. | If next episode locked and not covered by future entitlement, drawer opens on next navigation. | Preserve same-episode route context. |
| `unlocked` | `error` | Playback error panel with retry. | Drawer remains closed unless entitlement/access becomes locked by shell state. | Error and entitlement remain separate. |

## 7. Recommended local/static sample media contract

For Phase 4C, use a single safe sample asset record for proof-of-boundary testing. The record must be checked before any reviewer gate.

```ts
const safeSampleEpisodeSource: PlaybackSource = {
  id: "sample-midnight-lantern-oath-ep1-original-placeholder",
  showId: "midnight-lantern-oath",
  episodeNumber: 1,
  kind: "safe_sample_mp4",
  url: "/media/samples/midnight-lantern-oath/ep1-placeholder.mp4",
  mimeType: "video/mp4",
  durationSeconds: 30,
  poster: {
    url: "/media/samples/midnight-lantern-oath/poster-placeholder.jpg",
    alt: "Original placeholder poster for Midnight Lantern Oath sample video",
    rights: {
      status: "original_placeholder",
      owner: "SceneFlow / project team",
      evidence: "docs/moboreels/real-mvp/spikes/safe-video-boundary.md#sample-asset-log",
      launchUseApproved: false,
    },
  },
  rights: {
    status: "original_placeholder",
    owner: "SceneFlow / project team",
    evidence: "docs/moboreels/real-mvp/spikes/safe-video-boundary.md#sample-asset-log",
    launchUseApproved: false,
  },
};
```

Important: this is a contract shape, not proof that the file exists. If implementation follows, the sample file must be newly created original media or otherwise rights-cleared and logged in §11 before it is used.

## 8. Mobile viewport checklist, 390 x 844

Reviewer should verify each state on an iPhone-like mobile viewport around 390 x 844.

| State | Checklist |
| --- | --- |
| Loading safe sample | Poster/skeleton fits vertical player; no login/pay/pass/PWA prompt; controls are reachable. |
| Playing | Video area remains vertical and inline; title/episode metadata visible; progress does not overlap safe area. |
| Paused | Pause affordance is clear; play control remains tappable; no drawer appears. |
| Buffering / weak network | Spinner or weak-network copy is distinct from lock; no unlock CTA appears; retry does not navigate Home. |
| Ended | Episode-complete overlay offers `Continue to EP X`; if next is free, route continues; if next is locked, locked route opens drawer. |
| Error | Error copy names playback issue, not entitlement; retry is available; no payment/login prompt appears. |
| Locked | Provider is not playing behind overlay; locked panel is distinct from buffering/error; Unlock Drawer auto-opens on first locked entry. |
| Drawer closed / maybe later | User remains on same locked episode; tapping locked player area reopens drawer. |
| Mock unlocked | Same episode route includes `unlocked=1`; player area is playable for sample; success feedback does not send user Home. |
| Safe area | Bottom drawer CTA and player controls are not covered by iOS/home indicator safe area. |

## 9. Evidence required before reviewer gate

This spike spec is build-readiness documentation. If a local proof is produced later, attach the evidence below without crossing hard stops.

1. Provider interface draft: §5 of this document.
2. State mapping: §6 of this document.
3. Mobile viewport checklist: §8 of this document.
4. Sample asset log: §11 completed for every video/poster/caption used.
5. Local/staging verification matrix showing:
   - free episode sample plays without login/payment/prompt;
   - pause/play/progress/end events map to shell UI;
   - buffering/weak-network state is distinct from locked;
   - playback error state is distinct from locked;
   - first locked episode does not call the playable source;
   - Unlock Drawer still returns to same episode with `unlocked=1` in mock flow.
6. Confirmation that no production CDN/storage/video pipeline, licensed assets, real login, real payment, real entitlement, Facebook API, analytics, backend, database, deployment, DNS, or secrets were introduced.

## 10. Verification matrix template

| Scenario | Setup | Expected result | Evidence |
| --- | --- | --- | --- |
| Free EP1 load | `/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook` with safe sample source | Provider enters `loading` then `ready` / `playing`; no drawer. | Screenshot / test note. |
| Pause/resume | Tap pause, then play | Provider emits `paused` then `playing`; shell chrome remains playback-only. | Screenshot / event log. |
| Ended | Let sample reach end or simulate ended event | Shell shows episode complete CTA. | Screenshot / event log. |
| Buffering | Simulate slow source / devtools throttling | Shell shows weak-network state, not lock. | Screenshot. |
| Source error | Point to missing safe sample in local-only test | Shell shows playback error, not Unlock Drawer. | Screenshot. |
| First locked episode | `/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook` without `unlocked=1` | Shell renders locked panel; provider is not loaded; drawer opens. | Screenshot / code assertion. |
| Mock unlocked episode | `/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1` | Shell treats as mock post-unlock UX and can mount safe sample provider; no Home redirect. | Screenshot. |

## 11. Sample asset log

No production or licensed assets are approved by this document. Fill this table only with original/safe sample assets used for local or staging proof.

| Asset | Type | Rights status | Owner / creator | Evidence | Launch use approved? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `ep1-placeholder.mp4` | Video | To be created as original placeholder before implementation proof | SceneFlow / project team | Pending | No | Must not use competitor or licensed footage. |
| `poster-placeholder.jpg` | Poster | To be created as original placeholder before implementation proof | SceneFlow / project team | Pending | No | Gradient or frame from original sample only. |
| Captions, if any | Text track | Original placeholder only | SceneFlow / project team | Pending | No | Optional for spike; accessibility floor remains a later approval question. |

## 12. Stop conditions

Block immediately if any of the following occurs:

- The only available sample media is licensed, competitor-derived, scraped, user-uploaded without rights evidence, or otherwise unclear.
- A proof requires uploading media to production storage/CDN or configuring a production video service.
- A proof requires real auth, real payment, real entitlement, real backend/database, real Facebook API/analytics, production deployment, DNS, or secrets.
- A design treats HLS/CDN/DRM/encoding/storage/provider/vendor selection as approved for production.
- A playback error path is proposed to open the Unlock Drawer.
- A locked-state path is proposed to look like buffering, offline, or generic video error.
- `unlocked=1` is proposed as a real entitlement grant.

## 13. Go / no-go recommendation

Recommendation: GO for a later local/staging-only implementation spike if and only if:

1. The sample media is original or otherwise rights-cleared and logged in §11.
2. The implementation uses the provider boundary in §5 or an equivalent small interface.
3. The Watch shell computes access state before mounting playback.
4. The verification matrix in §10 passes at 390 x 844.
5. No hard-stop area is crossed.

Recommendation: NO-GO / revise if any reviewer cannot distinguish locked state from playback failure, if the provider tries to own entitlement, or if safe sample media cannot be proven.

## 14. Open questions for later approval, not answered by this spike

- Which real video provider, CDN, storage, ingest, and encoding workflow should be used for production?
- Does launch require HLS, MP4-only, adaptive bitrate, DRM, captions, multi-audio, or offline downloads?
- What is the legal accessibility floor for captions/subtitles in the target market?
- Which launch content is original, commissioned, or licensed, and where is rights evidence stored?
- Should post-unlock playback resume from the pre-lock timestamp or start from 0 for the first locked episode?

These questions remain outside Phase 4C implementation authority until explicit human approval is recorded.
