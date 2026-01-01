# PixelBot

A Discord bot built with TypeScript and Discord.js.

## Setup

### Prerequisites

- Node.js 16.6.0 or higher
- npm or yarn
- A Discord bot token from [Discord Developer Portal](https://discord.com/developers/applications)

### Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

3. **Add your Discord bot token to `.env`:**
   ```
   DISCORD_TOKEN=your_bot_token_here
   ```

### Build

Compile TypeScript to JavaScript:

```bash
npm run build
```

### Run

**Production (after building):**

```bash
npm start
```

**Development (with ts-node, no build needed):**

```bash
npm run dev
```

**Watch mode (auto-compile on changes):**

```bash
npm run watch
```

## Project Structure

```
src/
├── index.ts          # Main bot file
├── commands/         # Command handlers
└── events/           # Event listeners
   ├── ready.ts      # Bot ready event
   ├── interactionCreate.ts # Slash command dispatcher
   └── messageCreate.ts  # Legacy message watcher (redirects to slash)
```

## Features

# PixelBot

PixelBot is a Discord bot built with TypeScript and Discord.js v14. It uses a modular, event-driven architecture with dynamic loaders for commands and events, plus a simple MySQL-backed XP system and autorole support.

## Requirements

- Node.js 16.6.0+ and npm
- Discord bot credentials (token and application/client ID)
- MySQL database for XP tracking

## Quick start

```bash
npm install
cp .env.example .env  # or create .env manually
# fill in the environment values below
npm start              # runs src/main.ts with ts-node and dotenv
```

Other scripts:

- `npm run dev` – runs `ts-node src/index.ts` (adjust to `src/main.ts` if needed)
- `npm run build` – compile TypeScript to `dist`
- `npm run watch` – compile in watch mode

## Configuration (.env)

Required for Discord:

- `DISCORD_TOKEN` – bot token
- `CLIENT_ID` – application/client ID
- `GUILD_ID` – optional; if set, slash commands register to that guild only for faster rollout
- `OWNER_ID` – optional; enables owner-only command guard

Required for MySQL (XP storage):

- `HOST`
- `USER`
- `PASSWORD`
- `DATABASE`

XP table expected by `xpModule`:

```sql
CREATE TABLE IF NOT EXISTS user_xp (
   user_id VARCHAR(64) PRIMARY KEY,
   xp INT NOT NULL DEFAULT 0
);
```

## Project layout

```
src/
├── main.ts                 # Entry point; configures env and boots the bot
├── structures/Bot.ts       # Custom client, loaders, and slash command registrar
├── events/                 # Event handlers (auto-loaded)
│   ├── ready.ts            # Logs in tag on startup
│   ├── interactionCreate.ts# Routes slash commands with owner-only guard
│   ├── guildMemberAdd.ts   # Applies autorole on join
│   └── messageCreate.ts    # Placeholder (ignores bots)
├── handlers/autorole.ts    # Adds a fixed role ID to new members
├── modules/db.ts           # MySQL pool helper
└── modules/xp.ts           # XP helper backed by MySQL
```

The `commands/` directory is auto-loaded; add command files there to expose new slash commands.

## Features

- Discord.js v14 with TypeScript typings
- Dynamic loading of commands and events
- Slash command registration (global or guild-scoped)
- Owner-only command guard
- Autorole on member join
- MySQL-backed XP helper

## Adding commands

Place a file in `src/commands` exporting `{ data, execute, ownerOnly? }`. Example shape:

```ts
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Command } from "../@types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check latency"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("Pong!");
  },
  ownerOnly: false,
};

export default command;
```

On startup the bot loads the file, registers slash commands, and routes invocations via `interactionCreate`.

## Events

- `ready` – logs bot tag when connected
- `interactionCreate` – dispatches slash commands and enforces owner-only flag
- `guildMemberAdd` – assigns a fixed role (update the role ID in `handlers/autorole.ts` to match your server)
- `messageCreate` – placeholder; currently ignores bot messages

## XP helper

`xpModule.giveXP(userId)` increments a random 1–10 XP in the `user_xp` table using MySQL. Call it from commands or events as needed. Configure database credentials in `.env` and ensure the table exists.

## Notes

- Update the hardcoded role ID in `handlers/autorole.ts` to your server’s role.
- The bot currently attempts to load commands from an empty `src/commands` directory; add your own to expose functionality.

## Contributing

Issues and PRs are welcome. If you add commands or events, keep the dynamic loaders in mind and ensure required environment variables are documented.
