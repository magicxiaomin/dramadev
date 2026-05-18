# Phase 5 Questions

Status: questions only. These are not answers, commitments, approvals, or implementation instructions.

Any question touching a hard-stop area requires later explicit human approval before implementation.

## Funnel and UX questions

1. Should P1 keep manual `Continue to EP X`, or introduce a 3-second auto-next countdown after free episode completion?
2. Should every locked episode have a custom story hook, or only the first locked episode?
3. Should mock balance appear before the first lock, or only inside the Unlock Drawer?
4. Should Story Pass stay secondary on the first locked episode in all campaigns?
5. Should PWA install education appear after reaching the lock, after fake unlock success, on second visit, or not until later?
6. What evidence threshold should define merge-readiness for mobile safe-area drawer CTA visibility?

## Attribution and Facebook questions

7. Should future ad creatives deep-link to different starting episodes, or must P0/P1 always start at EP1?
8. Which optional attribution params should be preserved in URLs beyond `source=facebook`?
9. If real Facebook redirect/API work is considered later, who must approve scope, data handling, and compliance before implementation? Hard-stop approval required.
10. If Pixel/CAPI or production analytics are considered later, what event names, consent rules, and data minimization requirements apply? Hard-stop approval required.

## Unlock, payment, and entitlement questions

11. If real payment is considered later, what provider, legal copy, refund policy, and test environment are approved? Hard-stop approval required.
12. If real subscription or Story Pass billing is considered later, what renewal, cancellation, tax, and local pricing requirements apply? Hard-stop approval required.
13. If real login is considered later, where in the flow can it appear without violating free-preview-first behavior? Hard-stop approval required.
14. If server-side entitlement is considered later, what is the source of truth for unlocked episodes and pass state? Hard-stop approval required.
15. Should `unlocked=1` remain a fake-only review signal once production entitlement exists?

## Video and content questions

16. If real video playback is considered later, what provider boundary and fallback states are approved before implementation? Hard-stop approval required.
17. How should locked state remain visually distinct from video/network errors when real playback exists?
18. What content metadata is needed to support per-drama `freeEpisodes`, lock hooks, tags, episode ranges, and safe fake/test assets?
19. What policy prevents licensed or competitor assets from entering prototype or production branches? Human/legal approval required.

## Backend, database, and operations questions

20. If backend content retrieval is considered later, what API contract should the Watch page consume? Hard-stop approval required.
21. If database schema is considered later, what entities are required for shows, episodes, unlocks, wallet ledger, and attribution? Hard-stop approval required.
22. What environments are allowed for future non-production QA without touching production deploy, DNS, or secrets? Hard-stop approval required for production-related changes.
23. What secrets management and review process is required before any real service integration? Hard-stop approval required.
24. What CI/browser matrix is required before a future production-readiness decision?
