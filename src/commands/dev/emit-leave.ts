import { Events, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../@types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("emit-leave")
    .setDescription("Emits a guild member leave event for testing purposes.")
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
    let guild;
    try {
      guild = await inter.client.guilds.fetch(
        inter.options.getString("guild-id", true)
      );
    } catch {
      await inter.reply({
        content: "Guild not found.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    const userId = inter.options.getString("user-id") ?? inter.user.id;
    const member = await guild.members.fetch(userId);
    inter.client.emit(Events.GuildMemberRemove, member);
    await inter.reply({
      content: "Emitted guild member leave event.",
      flags: MessageFlags.Ephemeral,
    });
  },
};

export default command;