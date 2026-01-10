import { Events } from "discord.js";
import type { Event } from "../@types";
import type { Message } from "discord.js";

const event: Event = {
  name: Events.MessageCreate,
  once: false,
  execute(message: Message) {
    if (message.author.bot) return;
  },
};
export default event;
