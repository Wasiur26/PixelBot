import { GatewayIntentBits } from "discord.js";
import express from "express";
import { Bot } from "./client/Bot";

const client = new Bot({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const app = express();
const port = process.env.HTTP_PORT;

app.get("/health", (req, res) => {
  res.status(200).send("Alive");
});

app.listen(port, () => {
  console.log(`HTTP server is running on port ${port}`);
});

if (process.env.OWNER_ID) {
  client.ownerId = process.env.OWNER_ID;
}

void (async () => {
  await client.start();
})();

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception thrown:", error);
});
