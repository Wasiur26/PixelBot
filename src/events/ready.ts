import { Events, OAuth2Scopes, PermissionsBitField } from "discord.js";
import type { Event } from "../@types";
import type { Bot } from "../client/Bot";

const event: Event = {
  name: Events.ClientReady,
  once: true,
  execute(client: Bot) {
    console.info(`Bot logged in as ${client.user?.tag}`);
    console.log(
      client.generateInvite({
        scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
        permissions: [PermissionsBitField.Flags.Administrator],
      })
    );
  },
};

export default event;
