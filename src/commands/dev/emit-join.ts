import { Events, MessageFlags, SlashCommandBuilder } from "discord.js";
import type { Command } from "../../@types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("emit-join")
    .setDescription("Emits a guild member join event for testing purposes."),
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
    inter.client.emit(Events.GuildMemberAdd, member);
    await inter.reply({
      content: "Emitted guild member join event.",
      flags: MessageFlags.Ephemeral,
    });
  },
};

export default command;
