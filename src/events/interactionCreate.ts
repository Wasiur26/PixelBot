import { Interaction } from "discord.js";
import { Event } from "../@types";
import { Bot } from "../structures/Bot";

const event: Event = {
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as Bot;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      await interaction.reply({
        content: "Command not found.",
        ephemeral: true,
      });
      return;
    }

    if (
      command.ownerOnly &&
      client.ownerId &&
      interaction.user.id !== client.ownerId
    ) {
      await interaction.reply({
        content: "This command is restricted to the bot owner.",
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(
        `Error executing command ${interaction.commandName}:`,
        error
      );
      if (interaction.replied || interaction.deferred) {
        await interaction.editReply({
          content: "There was an error while executing this command.",
        });
      } else {
        await interaction.reply({
          content: "There was an error while executing this command.",
          ephemeral: true,
        });
      }
    }
  },
};

export default event;
