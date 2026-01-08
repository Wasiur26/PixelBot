import { GuildMember } from "discord.js";

export default function autorole(member: GuildMember) {
  const role = process.env.AUTO_ROLE_ID as string;
  if (member.user.bot || member.roles.cache.has(role)) return;
  member.roles.add(role).catch(console.error);
}