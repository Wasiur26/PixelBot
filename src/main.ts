import { GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import { Bot } from "./structures/Bot";

dotenv.config();

// Initialize custom client
const client = new Bot({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// Optionally set owner ID
if (process.env.OWNER_ID) {
  client.ownerId = process.env.OWNER_ID;
}

// Load commands and events
(async () => {
  await client.start();
})();
