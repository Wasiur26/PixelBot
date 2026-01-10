import { Events } from "discord.js";
import type { Event } from "../@types";
import type { Client } from "discord.js";

const event: Event = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.info(`Bot logged in as ${client.user?.tag}`);
  },
};

export default event;
