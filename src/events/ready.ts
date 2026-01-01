import { Client, Events } from "discord.js";
import { Event } from "../@types";

const event: Event = {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.info(`Bot logged in as ${client.user?.tag}`);
  },
};

export default event;
