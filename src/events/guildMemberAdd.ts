import { Events, GuildMember } from "discord.js";
import { Event } from "../@types";
import autorole from "../handlers/autorole";
import welcomecard from "../handlers/welcomecard";

const event : Event= {
  name: Events.GuildMemberAdd,
  once: false,
  async execute(member: GuildMember) {
    const username = member.user.username;
    const avatarUrl = member.user.displayAvatarURL({ extension: "png", size: 256 });
    const memberCount = member.guild.memberCount;
    const backgroundPath = "../../public/bg.png";

    autorole(member);
    welcomecard(member);
  },
};

export default event;