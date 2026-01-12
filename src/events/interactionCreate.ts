import { MessageFlags } from "discord.js";
import type { Event } from "../@types";
import type { Interaction } from "discord.js";

const event: Event = {
  name: "interactionCreate",
  async execute(inter: Interaction) {
    if (!inter.isChatInputCommand()) return;

    const client = inter.client;
    const command = client.commands.get(inter.commandName);

    if (!command) {
      await inter.reply({
        content: "Command not found.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    if (
      command.ownerOnly &&
      client.ownerId &&
      inter.user.id !== client.ownerId
    ) {
      await inter.reply({
        content: "This command is restricted to the bot owner.",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }

    try {
      await command.execute(inter);
    } catch (error) {
      console.error(`Error executing command ${inter.commandName}:`, error);
      if (inter.replied || inter.deferred) {
        await inter.editReply({
          content: "There was an error while executing this command.",
        });
      } else {
        await inter.reply({
          content: "There was an error while executing this command.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};

export default event;
