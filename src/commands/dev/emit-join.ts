import { Events, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../@types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("emit-join")
    .setDescription("Emits a guild member join event for testing purposes.")
    .addStringOption((option) =>
      option
        .setName("guild-id")
        .setDescription("The guild ID to emit the event in.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("user-id")
        .setDescription("The user ID of the member to emit the event for.")
        .setRequired(false)
    ),
  ownerOnly: true,
  async execute(inter) {
    const guild = await inter.client.guilds
      .fetch(inter.options.getString("guild-id", true))
      .catch(() => null);
    if (!guild) {
      await inter.reply({
        content: "Guild not found.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const userId = inter.options.getString("user-id") ?? inter.user.id;
    const member = await guild.members.fetch(userId);
    inter.client.emit(Events.GuildMemberAdd, member);
    await inter.reply({
      content: "Emitted guild member join event.",
      flags: MessageFlags.Ephemeral,
    });
  },
};

export default command;
