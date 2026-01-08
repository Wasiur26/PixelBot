import { Events, GuildMember } from "discord.js";
import { Event } from "../@types";
import leavemessage from "../handlers/leavemessage";

const event : Event= {
  name: Events.GuildMemberRemove,
  once: false,
  async execute(member: GuildMember) {
    leavemessage(member);
  },
};

export default event;