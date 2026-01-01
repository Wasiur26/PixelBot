import { GuildMember } from "discord.js";

export default function autorole(member: GuildMember) {
  member.roles.add("1294331221446496346").catch(console.error);
}