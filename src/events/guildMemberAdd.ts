import { Events } from "discord.js";
import autorole from "../handlers/autorole";
import welcomecard from "../handlers/welcomecard";
import type { Event } from "../@types";
import type { GuildMember } from "discord.js";

const event: Event = {
  name: Events.GuildMemberAdd,
  once: false,
  execute(member: GuildMember) {
    autorole(member);
    void welcomecard(member);
  },
};

export default event;
