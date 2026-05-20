# SceneFlow MVP 实际在线测试 / Launch-Readiness Testing 准备清单

状态：规划证据；中文 readiness matrix；不授权实施生产上线或真实集成。
日期：2026-05-20
范围：DramaDev / SceneFlow MVP，Facebook ad conversion P0 路径。

## 0. 结论

Verdict：REVISE BEFORE ACTUAL ONLINE TESTING；APPROVE ONLY FOR FAKE-ONLY STAGING/DEMO READINESS。

当前仓库已有 fake-only 本地/演示路径证据，可继续做非生产、无真实服务的 staging/demo 验证；但“实际在线测试 / launch-readiness testing”还缺少环境边界、测试资产授权、隐私/同意、观测方案、支付/登录/权益 test-mode 合同、后端/API 数据合同、安全法务、发布回滚和事故响应等审批与前置条件。任何生产部署、DNS/cutover、生产 secrets、真实 payment/subscription/login/Facebook API/analytics/backend/database/entitlement/video infra、R2/CDN/NovelHub 生产基础设施、或授权不清内容资产，均属于硬停止。

P0 不可破坏路径：

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain
-> first locked episode
-> Unlock Drawer
-> fake unlock/pass
-> same episode with unlocked=1
```

## 1. Evidence reviewed

- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
  - §2/§6/§7：P0 广告落地到 Watch，free episode chain，首个 locked episode，Unlock Drawer，mock unlock 后回到同一 episode。
  - §3/§11/§13/§14：P0 不做真实 payment/subscription/Facebook/video/analytics/login/backend/database/entitlement。
  - §8/§9/§15：Watch、Episode Sheet、locked state、Unlock Drawer、safe area、locked-vs-error、QA acceptance。
  - §10：指标是规划对象；P0 不需要生产 analytics processing。
- `docs/moboreels/prototype-b-spec.md`：Prototype B / SceneFlow 以 PRD 为准。
- `docs/moboreels/phase-4g/qa-readiness.md`：fake-only P0 QA baseline、390×844 mobile viewport、manual pass checklist。
- `docs/moboreels/phase-5/p1-evidence-readiness.md`：未来浏览器/viewport 和 safe-area 证据阈值仍为 proposal，不授权 CI/browser/runtime 变更。
- `package.json`：现有脚本包括 `pnpm test:unit`、`pnpm lint`、`pnpm build`、`pnpm test:e2e:p0`。
- `playwright.config.ts`：当前自动化仅配置 `p0-mobile-390x844` Chromium mobile-emulation row。
- `tests/e2e/variant-b-p0-facebook.spec.ts`：fake-only P0 harness 已覆盖 ad landing、free chain、first locked episode、Unlock Drawer、fake unlock/pass same-episode return、并拦截/断言无 hard-stop 真实服务请求。
- `artifacts/demo-readiness/2026-05-19-mvp-readiness-audit.md`：本地 fake-only demo route 曾通过 unit/lint/build/e2e:p0；该结论不等于生产或真实在线测试授权。

## 2. Readiness matrix

| 领域 | A. 现在可做：fake-only staging/demo 范围 | B. 需人类批准后可继续规划 | C. 硬停止：本任务和 P0 不得执行 |
| --- | --- | --- | --- |
| 环境 / Hosting | 使用本机或临时非生产预览环境验证 P0 route；环境名称必须标注 demo/staging/fake-only；不得连接真实用户流量；记录 base URL、commit、branch、测试时间。 | 规划 preview URL 生命周期、访问控制、测试窗口、basic auth/IP allowlist、日志保留期限、成本上限、谁能访问。 | 生产部署、DNS/cutover、正式域名切流、生产 secrets、CDN/R2/NovelHub 生产基础设施、付费生产资源开通。 |
| P0 route / query params | 验证 `/variant-b/watch/[showId]?episode=1&source=facebook`；保留 `episode`、`source`；mock unlock 返回同一集 `unlocked=1`；可继续跑 `pnpm test:e2e:p0`。 | 规划未来 attribution params 的非生产兼容测试：`campaign_id/adset_id/ad_id/creative_id/placement/utm_*` 只作为 inert URL context。 | 接入真实 Facebook redirect/API、Pixel/CAPI、真实 campaign 数据、生产 analytics processing，或将用户送到 Home/Search/Detail 首屏。 |
| 测试数据 / 内容资产 | 使用现有 mock show、mock balance、mock cost、mock poster/video placeholder；资产文案明确 fake/mock；不使用竞品或未授权内容。 | 规划可授权的测试剧名、海报、短视频素材、配音、字幕、地区语言版本；列出权利证明和替换策略。 | 使用 licensed/competitor/uncleared assets；复制竞品标题、海报、视频、价格、文案；使用真实付费内容或生产素材库。 |
| QA 浏览器 / 设备矩阵 | 继续使用 Phase 4G baseline：390×844 mobile-first；Chromium mobile emulation 自动化；Desktop Chrome responsive 390×844 手动证据；可补 WebKit/Safari 手动截图但不改 CI。 | 规划扩展矩阵：Mobile Safari/WebKit、Chromium mobile、360×780 stress row、393×852 sanity row、1280×720 smoke；明确截图、console、network evidence 模板。 | 未经批准修改 CI/browser installs/Playwright config/package/lockfile；把 desktop smoke 当作 P0 通过证据；跳过 390×844 主 viewport。 |
| P0 UX 验收 | 验证 free preview 不要求 login/recharge/PWA/story pass；首个 locked episode 自动打开 Unlock Drawer；locked state 不像 network/video error；drawer CTA 层级正确；same-episode return。 | 规划更详细的 safe-area、弱网/错误态文案、Episode Sheet range tabs、manual continue vs countdown 的 P1 验收。 | 在 free preview 前展示 login、payment、subscription、PWA prompt；mock unlock 后回 Home；丢失 episode/show context；真实视频/错误处理基础设施。 |
| Observability / Analytics / Consent | fake-only 可记录人工测试表格：URL、viewport、截图、console/network 观察；不得发送真实 analytics event；可用本地 Playwright request guard。 | 规划 consent banner、privacy notice、analytics taxonomy、event schema、retention、DPA、Meta Pixel/CAPI test-mode 方案、用户退出机制；需法律/隐私批准。 | 接入生产 analytics、Meta/Facebook Pixel/CAPI、第三方追踪、真实用户标识、cookie/session 追踪、跨站 attribution，无同意即采集。 |
| Payment / Auth / Entitlement test-mode | 保持 `unlocked=1` mock unlock、mock Story Pass、mock balance/cost；无真实登录、支付、订阅、钱包、权益状态。 | 规划支付 sandbox、auth test tenant、entitlement state machine、refund/cancel test cases、test card policy、错误码和 UX copy；需产品/法律/安全批准。 | 真实支付、真实订阅、真实登录、真实 wallet ledger、真实 entitlement/backend session、Stripe/支付生产密钥、真实用户账户。 |
| Backend / API / Data contracts | 使用静态 fixture 和客户端 mock；可写接口契约草案和字段映射；不得调用真实 backend/database。 | 规划 read-only content API contract、story/episode/freeEpisodes/unlock cost schema、versioning、fixture-to-API diff tests、mock server strategy。 | 建数据库、schema migration、生产 API、server-side entitlement、真实内容检索、R2/video storage/transcoding/DRM、NovelHub 生产依赖。 |
| Security / Privacy / Legal | 做规划清单：hard-stop dependency scan、无 secrets、无外部 trackers、无未授权资产、无真实 PII；演示 URL 限访问。 | 安排安全评审、隐私评审、法律/内容授权评审、支付条款/退款/订阅文案评审、品牌显著决策审批。 | 收集真实 PII、开通生产 secrets、发布真实订阅条款、对外承诺价格/退款/自动续费、使用未清权素材。 |
| Release / Rollback / Incident | fake-only 可规划 release checklist、demo owner、测试窗口、回滚到本地/preview 关闭、known gaps；不执行上线。 | 规划正式 release train、rollback runbook、incident severity、on-call、status comms、feature flags、kill switch、monitoring SLO。 | 生产 release、DNS 切换、真实流量导入、事故流程以外上线、无 rollback 的外部测试。 |
| Approval gates | 当前可产出 planning docs、evidence templates、manual checklist、mock-only QA runbook。 | 需要明确批准人和批准记录：产品、工程、安全、法律/隐私、内容授权、支付、增长/Meta measurement、运维。 | 口头默认上线；把 demo-ready 当 launch-ready；任何 worker 自行越权开通真实服务或生产资源。 |

## 3. Key findings

1. Fake-only P0 demo-readiness 与 actual online testing readiness 是两件事。现有证据支持前者，不支持后者。
2. 当前自动化重点正确：P0 path、query context、mock unlock、hard-stop request guard；但浏览器矩阵仍窄，主要是 Chromium mobile emulation。
3. Launch-readiness testing 的最大 blocker 不是页面功能，而是边界治理：环境隔离、资产授权、隐私同意、真实服务 test-mode、后端契约、安全法务、回滚事故。
4. P0 绝不能因为“在线测试”而引入真实 backend/payment/Facebook/analytics/video。若需要这些，只能作为单独批准的 P1/P2 planning 或 future integration work。

## 4. Hidden dependencies

- 非生产 URL 若可被外部访问，需要 access control、robots/noindex、测试窗口、日志保留和成本上限。
- “Facebook source” 在 P0 只是 URL source context；真实广告点击、Pixel/CAPI、campaign attribution 是单独增长/隐私/法律依赖。
- 支付/auth/entitlement 即使是 sandbox，也会引入账户、密钥、条款、退款、税务、地区合规、数据保留等依赖。
- 真实视频或 CDN/R2 会引入内容授权、转码、DRM、带宽成本、可用性、删除流程。
- 手动 QA 需要稳定 test show id、first locked episode、fixture baseline、截图命名规范和可复现脚本。

## 5. Risks and mitigations

| 风险 | 影响 | 缓解 |
| --- | --- | --- |
| 把 demo-ready 误判为 launch-ready | 越权上线或真实用户暴露 | 在所有文档和环境 banner 标注 fake-only/non-production；审批 gate 未过不得上线。 |
| 浏览器证据不足 | Mobile Safari safe-area、drawer CTA、touch 行为漏测 | 先补手动 WebKit/Safari evidence；CI 扩展需另行批准。 |
| 真实 analytics/payment/auth 被“顺手接入” | 隐私、合规、安全、成本风险 | 保留 banned host/request guard；任何真实服务 proposal 必须单独 task + 批准。 |
| 内容资产不清权 | 法务/品牌风险 | 仅用 mock/自有/授权素材；建立资产登记表。 |
| 在线 preview 被索引或外传 | 非公开原型泄露 | noindex、访问控制、短期 URL、到期关闭、最小日志。 |
| Mock unlock 与未来真实 entitlement 合同不一致 | 后续重构风险 | 先做 contract planning：字段、状态机、错误码、return route invariant。 |

## 6. Missing acceptance criteria / tests before actual online testing

必须补齐或明确记录：

- 环境：非生产 URL、访问控制、noindex、测试窗口、owner、关闭/回滚方式。
- QA：至少 390×844 P0 path 的 Chromium + WebKit/Safari 手动证据；drawer CTA safe-area 截图；console/network 记录。
- Network guard：证明没有 payment/auth/Facebook/analytics/backend/database/video/entitlement 请求。
- 内容资产：每个 show/poster/video/copy 的授权状态或 mock 状态。
- Consent/Privacy：若有任何 tracking proposal，必须先有 consent copy、privacy notice、data map、retention plan。
- Payment/auth/entitlement：sandbox/test-mode contract、test tenants、test cards、错误路径、退款/取消文案；未批准前仅 mock。
- Backend/API：story/episode/freeEpisodes/cost/balance/unlock state contract；fixture 与未来 API 的差异表。
- Release/incident：rollback owner、kill switch/disable plan、incident contacts、decision log。

## 7. Infrastructure boundary check

允许：

- Docs-only planning under `artifacts/launch-testing-readiness/` 或 `docs/moboreels/phase-5/`。
- 本地/非生产 fake-only QA checklist 和人工证据模板。
- 继续运行现有本地 checks：`pnpm test:unit`、`pnpm lint`、`pnpm build`、`pnpm test:e2e:p0`。

不允许：

- 生产 deploy、DNS/cutover、production secrets、paid production resources。
- 真实 payment/subscription/login/Facebook API/analytics/backend/database/entitlement/video infra。
- R2/CDN/NovelHub production infra。
- 未清权内容资产或竞品素材。
- CI/browser/package/workflow/runtime code changes，除非另有明确批准任务。

## 8. Recommended plan edits

1. 将“online testing”拆成两个阶段：
   - Phase A：fake-only non-production preview/demo testing，目标是证明 P0 funnel 可被人类复现。
   - Phase B：actual integration readiness planning，目标是审批真实服务 test-mode prerequisites；不执行真实接入。
2. 为 Phase A 增加 evidence template：URL、commit、show id、first locked episode、browser/device、viewport、screenshots、console/network、hard-stop request observation、pass/fail。
3. 为 Phase B 分别创建审批包：privacy/consent、payment/auth/entitlement sandbox、backend/API contract、content assets, release/rollback/incident。
4. 保持 P0 invariant 为所有 checklist 的首行 gate；任何破坏 same-episode return 或 free-preview-before-prompts 的改动必须退回。
5. 明确 Stop Conditions：任何真实服务、生产资源、secrets、DNS、支付、登录、Facebook、analytics、backend/database、entitlement、video、未授权资产需求出现时，立即停止并走人类审批。

## 9. Safe next step

安全下一步：创建一个非生产、fake-only 的“在线演示证据包”任务，只允许：

- 使用现有代码和现有 fake-only P0 harness。
- 生成手动 QA evidence template。
- 在非生产 URL 或本地手机可访问 URL 上记录 390×844 / WebKit-Safari-equivalent / Chromium mobile evidence。
- 确认没有真实服务请求、没有 production secrets、没有真实用户数据。

不得在该下一步中开通生产资源、接入真实服务、修改 runtime code、修改 CI、或导入未授权资产。

## 10. Stop conditions

若出现以下任一条件，立即停止并升级人工审批：

- 要求部署生产、配置 DNS/cutover、接入正式域名或真实广告流量。
- 需要生产 secrets、真实 payment/subscription/login/Facebook API/analytics/backend/database/entitlement/video infra。
- 需要 Stripe/Meta/Facebook production credentials、Pixel/CAPI、真实用户 tracking、真实支付或真实账户。
- 需要 R2/CDN/NovelHub 生产基础设施或 paid production services。
- 需要使用未授权、竞品、licensed unclear 的海报、视频、标题、文案。
- 需要改变 P0 route invariant，尤其是 free preview 前弹 prompt、post-unlock 回 Home、丢失 episode/source context。
- 安全、隐私、法律、内容授权、支付条款、发布/回滚 owner 未明确。
