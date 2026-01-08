import { GuildMember } from "discord.js";

export default function joinmessage(member: GuildMember) {
  const channelId = process.env.WELCOME_CHANNEL_ID;
  if (!channelId) return;
  const channel = member.guild.channels.cache.get(channelId);
  if (!channel || !channel.isTextBased()) return;
  channel.send(`Welcome to the server, ${member.user.tag}!`);
}
