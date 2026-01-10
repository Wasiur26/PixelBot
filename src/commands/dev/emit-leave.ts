import { Events, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../@types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("emit-leave")
    .setDescription("Emits a guild member leave event for testing purposes."),
  ownerOnly: true,
  async execute(inter) {
    const guild = inter.guild;
    if (!guild) {
      await inter.reply({
        content: "This command can only be used in a guild.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    const member = await guild.members.fetch(inter.user.id);
    inter.client.emit(Events.GuildMemberRemove, member);
    await inter.reply({
      content: "Emitted guild member leave event.",
      flags: MessageFlags.Ephemeral,
    });
  },
};

export default command;
