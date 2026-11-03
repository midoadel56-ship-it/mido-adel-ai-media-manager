

 Required Worker variables/secrets
Add these under Worker → Settings → Variables and Secrets:

- `BOT_TOKEN` — Secret (new token from BotFather; never commit it)
- `WEBHOOK_SECRET` — Secret (a random 32+ character string using only A-Z, a-z, 0-9, underscore, hyphen)
- `OWNER_ID` — Variable: `7469308202`
- `CHANNEL_ID` — Variable: `@medopho`

 Deploy
1. Create or open the Cloudflare Worker.
2. Replace the editor contents with `worker.js`.
3. Save and Deploy.
4. Add the four values above under Settings → Variables and Secrets, then redeploy if prompted.

 Set Telegram webhook
After deployment, use the Cloudflare Worker URL, for example:
`https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/telegram/webhook`

Run this command on your own computer after replacing placeholders locally (do not send the token to anyone):

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" ^
  -H "Content-Type: application/json" ^
  -d "{"url":"https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev/telegram/webhook","secret_token":"YOUR_WEBHOOK_SECRET"}"
```

On macOS/Linux, replace the `^` line continuations with `\`.

Then open the bot in Telegram and send `/start`, then `/status`, then `/testchannel`.

The bot must remain an administrator of `@medopho` with permission to post messages.

This is a starter bot: it handles `/start`, `/help`, `/status`, and `/testchannel`. Scheduling, analytics, and other social-platform integrations are not included yet.
