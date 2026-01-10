import { Events } from "discord.js";
import leavemessage from "../handlers/leavemessage";
import type { Event } from "../@types";
import type { GuildMember } from "discord.js";

const event: Event = {
  name: Events.GuildMemberRemove,
  once: false,
  execute(member: GuildMember) {
    leavemessage(member);
  },
};

export default event;
