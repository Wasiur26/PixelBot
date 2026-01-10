import { GatewayIntentBits } from "discord.js";
import { Bot } from "./structures/Bot";

const client = new Bot({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

if (process.env.OWNER_ID) {
  client.ownerId = process.env.OWNER_ID;
}

void (async () => {
  await client.start();
})();
