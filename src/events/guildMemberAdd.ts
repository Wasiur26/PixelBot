import { Events, GuildMember } from "discord.js";
import { Event } from "../@types";
import autorole from "../handlers/autorole";

const event : Event= {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member: GuildMember) {
    autorole(member);
  },
};

export default event;