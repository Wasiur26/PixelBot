import type { GuildMember } from "discord.js";
export default function leavemessage(member: GuildMember) {
  const channelId = process.env.FAREWELL_CHANNEL_ID;
  if (!channelId) return;
  const channel = member.guild.channels.cache.get(channelId);
  if (!channel || !channel.isTextBased()) return;
  void channel.send(`Goodbye ${member.user.tag}. Anyways Ibshar cdi.`);
}
