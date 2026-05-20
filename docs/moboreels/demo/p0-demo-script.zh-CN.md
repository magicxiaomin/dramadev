# SceneFlow P0 演示脚本（中文一页版）

演示对象：当前本地、静态、fake-only 的 SceneFlow P0 原型。

演示时长：约 2-3 分钟。

演示边界开场白：

“今天展示的是本地临时预览里的 SceneFlow P0 假数据原型，不是生产环境。这里没有真实 Facebook 集成、没有 Pixel/CAPI/analytics、没有登录、没有真实支付或订阅、没有钱包账本、没有后端数据库、没有真实权益服务，也没有真实视频基础设施。我们只验证一个手机端转化路径：Facebook 风格入口直接进入短剧观看页，用户先免费看，再在第一个锁集看到 Unlock Drawer，并且 fake 解锁后仍回到同一集。”

演示主线：

1. 先打开 P0 入口：

   ```txt
   /variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
   ```

   说明：这是广告点击后应进入的 watch-first 路由。用户不是回到 Home，也不是 Search 或剧集详情页。`source=facebook` 只是本地路由上下文，不会调用 Facebook API，也不会发送真实归因或埋点。

2. 展示 EP1 免费试看。

   说明：EP1 直接展示 Watch 页面和 mock 播放区域。用户不需要登录，不会先看到充值、订阅、Story Pass、PWA 安装或其它提示。这里的播放画面是静态原型，不是真实流媒体。

3. 依次走完免费链路 EP1 -> EP5。

   说明：`Midnight Lantern Oath` 的本地 fixture 设置是 EP1 到 EP5 免费，EP6 是第一个锁集。每一集完成后继续下一集，验证“先看内容，再遇到锁点”的节奏。

4. 到达 EP6 第一个锁集。

   说明：EP6 自动进入 locked 状态并打开 Unlock Drawer。Drawer 展示当前剧名、EP6、mock 余额 `80 coins`、单集 mock 成本 `36 coins`、主按钮 `Unlock EP 6`、次按钮 `Get Story Pass (mock)`，并说明 mock 解锁会回到当前集。

5. 关闭 Drawer，再点击锁定播放区域重新打开。

   说明：点击 `Maybe later` 后，用户仍停留在 EP6 锁定页，不会被送回 Home 或丢失集数上下文。点击锁定播放区域可以再次打开 Drawer。

6. 演示单集 fake 解锁。

   说明：点击 `Unlock EP 6` 后，原型通过 URL query 模拟成功：

   ```txt
   /variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1
   ```

   这不是生产权益；`unlocked=1` 只是本地 mock 状态。验收重点是：仍然回到同一部剧、同一 EP6，不返回 Home，不丢失 `source=facebook` 上下文。

7. 演示 Story Pass fake 往返。

   说明：回到 EP6 锁定 Drawer，点击 `Get Story Pass (mock)` 进入 mock pass 页：

   ```txt
   /variant-b/pass?story=midnight-lantern-oath&episode=6&source=facebook
   ```

   这里没有真实订阅、续费、取消、税费、退款或支付处理器。点击 mock Story Pass 返回按钮后，同样回到 EP6 且带 `unlocked=1`。

收尾总结：

“这个 P0 demo 只验证 watch-first 转化链路：广告入口 -> EP1 免费试看 -> 免费链路 -> EP6 第一个锁点 -> Unlock Drawer -> fake 单集解锁或 Story Pass -> 回到同一集。任何生产部署、公开链接、真实支付、登录、Facebook API、analytics、后端、数据库、权益、视频、法律合规或品牌资产决策，都不属于本次 demo 范围。”
