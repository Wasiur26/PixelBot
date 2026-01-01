import { Events, Message } from "discord.js";
import { Event } from "../@types";

const event: Event = {
  name: Events.MessageCreate,
  once: false,
  async execute(message: Message) {
    if (message.author.bot) return;
  },
};
export default event;
