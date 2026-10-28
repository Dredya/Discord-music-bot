# Nyashko music — Discord Music Bot

A personal Discord bot that plays music from YouTube. Slash commands only, restricted to a single guild.

## Prerequisites (already installed on this machine)

- Node.js (LTS) — `node --version`
- ffmpeg — `ffmpeg -version`
- (Optional, recommended) yt-dlp for more robust YouTube playback: `pip install yt-dlp`

## Setup

1. **Create the Discord application**
   - Go to https://discord.com/developers/applications
   - **New Application** → name it `Nyashko music`
   - **Bot** tab → Add Bot → **Reset Token** → copy it (this is `DISCORD_TOKEN`)
   - **General Information** → copy **Application ID** (this is `CLIENT_ID`)
   - **OAuth2 → URL Generator** → scopes: `bot`, `applications.commands`
     - Bot permissions: Connect, Speak, Send Messages, Embed Links, Use Voice Activity
   - Copy the generated URL, open it, add the bot to your server

2. **Get your server (guild) ID**
   - Discord client → Settings → Advanced → enable **Developer Mode**
   - Right-click your server → **Copy Server ID** (this is `GUILD_ID`)

3. **Configure environment**
   ```bash
   copy .env.example .env
   ```
   Fill in `DISCORD_TOKEN`, `CLIENT_ID`, `GUILD_ID` in `.env`.

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Register slash commands (guild-scoped, instant)**
   ```bash
   npm run deploy
   ```

6. **Run the bot**
   ```bash
   npm start
   ```

## Commands

| Command | Description |
|---|---|
| `/play <query or URL>` | Play or enqueue a YouTube track |
| `/pause` / `/resume` | Pause / resume |
| `/skip` | Skip current track |
| `/stop` | Stop and disconnect |
| `/queue` | Show the queue |
| `/nowplaying` | Current track + progress |
| `/volume <0-100>` | Set volume |
| `/loop <off/track/queue>` | Loop mode |
| `/shuffle` | Shuffle queue |
| `/remove <position>` | Remove a queued track |
| `/clear` | Clear the queue |

## Troubleshooting

- **No sound / playback errors:** make sure ffmpeg is on PATH (`ffmpeg -version`). Also try `pip install yt-dlp` — the YouTube extractor uses it as a fallback.
- **Commands not showing:** re-run `npm run deploy`, and check `GUILD_ID` matches your server.
- **"Used disallowed intents":** this bot uses only `Guilds` + `GuildVoiceStates`; ensure those are enabled in the portal if needed (they're non-privileged).
- **YouTube breaks after an update:** update deps with `npm update discord-player discord-player-youtubei`, then restart.

## Notes

- The bot only responds in the guild set by `GUILD_ID`.
- It runs while your PC is on. For 24/7 hosting, move to a VPS and run with a process manager (pm2).
- Node modules and `.env` are gitignored — never commit your token.
