# Phase 4G Known Gaps Register

Status: docs-only, fake-only. Every item below is explicitly outside Phase 4G scope unless a later human-approved task changes scope.

| Gap | Phase 4G status | Why not in Phase 4G | Later approval needed? |
| --- | --- | --- | --- |
| Real payment processing | Not Phase 4G scope | P0 uses fake unlock/pass only; real payment is a hard stop. | Yes, human approval required before any implementation. |
| Real subscription or Story Pass billing | Not Phase 4G scope | P0 may show fake Story Pass copy only; no real subscription terms or billing. | Yes, human approval required. |
| Facebook redirect/API integration | Not Phase 4G scope | P0 route uses `source=facebook`; real Facebook APIs are excluded. | Yes, human approval required. |
| Real analytics, Pixel, or CAPI | Not Phase 4G scope | PRD says P0 does not need analytics processing; production analytics are P2. | Yes, human approval required. |
| Login or account creation | Not Phase 4G scope | Free preview must not require login; production login is P2. | Yes, human approval required. |
| Entitlement service or wallet ledger | Not Phase 4G scope | `unlocked=1` is the fake P0 unlock state; no server-side entitlement. | Yes, human approval required. |
| Real video player or streaming pipeline | Not Phase 4G scope | P0 uses mock/static playback behavior; real video is a hard stop/P2 item. | Yes, human approval required. |
| Backend content service | Not Phase 4G scope | Phase 4G does not add backend/database/runtime surfaces. | Yes, human approval required. |
| Database schema or migrations | Not Phase 4G scope | No database work is authorized for this docs-only package. | Yes, human approval required. |
| Production deployment | Not Phase 4G scope | Production deploy/cutover is a hard stop. | Yes, human approval required. |
| DNS/cutover | Not Phase 4G scope | DNS changes are production infra and outside P0 docs. | Yes, human approval required. |
| Secrets or environment configuration | Not Phase 4G scope | Phase 4G must not touch secrets, env files, or credentials. | Yes, human approval required. |
| Licensed/competitor assets | Not Phase 4G scope | PRD forbids copying competitor brands, titles, posters, videos, pricing, or copy. | Yes, human/legal approval required. |
| PWA install prompt optimization | Not Phase 4G scope | P0 only verifies prompt is not before free playback; later timing is P1. | Product approval required for P1 behavior. |
| Campaign-specific ad creative mapping | Not Phase 4G scope | Future attribution params must not disrupt P0 routing; mapping is P1/P2 planning. | Product approval required. |
| Lock-point experimentation/A-B testing | Not Phase 4G scope | P0 uses per-drama `freeEpisodes`; testing is future scope. | Product and analytics approval required. |

Phase 4G reviewers should record these as known gaps, not merge blockers for the fake-only P0 path unless a PR unexpectedly implements or depends on one of them.
