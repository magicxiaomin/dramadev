# SceneFlow P0 local phone-preview instructions

These instructions are limited to local or temporary non-production preview of the fake-only static prototype.

## Allowed scope

Allowed:

- Local laptop preview using `127.0.0.1`.
- Same-LAN phone preview using the laptop's private LAN IP.
- Temporary local server against the generated `out/` directory.
- Screenshot, screen recording, and checklist capture for demo review.

Not allowed:

- Production deployment.
- DNS/cutover.
- Public URL or public tunnel.
- Production secrets, service credentials, or external account setup.
- Real payment, subscription, login, Facebook API, analytics, backend, database, entitlement, or video infrastructure.
- NovelHub production infrastructure.

## Commands

Run from the repository root.

1. Install dependencies if needed:

   ```bash
   pnpm install --frozen-lockfile
   ```

2. Build the static export:

   ```bash
   pnpm build
   ```

3. Serve the generated `out/` directory with clean URL support:

   ```bash
   npx --yes serve@14.2.5 out -l tcp://0.0.0.0:4173
   ```

   Keep this server running only for the local demo window. Stop it with `Ctrl-C` when finished.

## Laptop preview URL

```txt
http://127.0.0.1:4173/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
```

## Same-LAN phone preview URL

1. Confirm the laptop and phone are on the same trusted Wi-Fi/LAN.
2. Find the laptop LAN IP:

   ```bash
   hostname -I
   ```

3. Open this route on the phone, replacing `<laptop-lan-ip>` with the private LAN address:

   ```txt
   http://<laptop-lan-ip>:4173/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
   ```

Example only:

```txt
http://192.168.1.23:4173/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
```

Do not paste real public IPs, secrets, tokens, or account identifiers into demo notes or screenshots.

## Local HTTP sanity checks

With the local server running, these should return HTTP 200-style responses:

```bash
curl -I 'http://127.0.0.1:4173/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook'
curl -I 'http://127.0.0.1:4173/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook'
curl -I 'http://127.0.0.1:4173/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1'
curl -I 'http://127.0.0.1:4173/variant-b/pass?story=midnight-lantern-oath&episode=6&source=facebook'
```

## Troubleshooting

If the phone cannot connect:

- Confirm both devices are on the same trusted LAN/Wi-Fi.
- Confirm the server is still running.
- Confirm the server command is bound to `0.0.0.0`, not only `127.0.0.1`.
- Confirm the laptop firewall allows temporary inbound LAN access to port `4173`.
- Stop and restart the local server if the build changed.
- Do not work around connectivity issues with public hosting, public tunnels, DNS changes, or production deployment.

## What to say if stakeholders ask for a shareable link

“P0 demo preview is intentionally local-only for now. We can capture screenshots or a screen recording from the local prototype. A public URL, tunnel, production deployment, DNS change, or external integration would be a separate later-phase decision and is out of scope for this fake-only demo package.”
